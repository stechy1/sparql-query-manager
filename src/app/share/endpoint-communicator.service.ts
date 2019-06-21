import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { ParameterValue, Query } from '../query/query';
import { QueryResultService } from '../query-result/query-result.service';
import { QueryResult, ResultState } from '../query-result/query-result';
import { parseQueryResult, QueryResultStorageEntry } from '../query-result/query-result-storage.entry';
import { SettingsService } from '../settings/settings.service';
import { environment } from '../../environments/environment';
import { ServerResponceParserFactory } from './server-responce-parsers/server-responce-parser-factory';
import { ResponceFormat } from './responce.format';

@Injectable({
  providedIn: 'root'
})
export class EndpointCommunicatorService {

  static readonly LAST_QUERY_KEY = 'last-query';
  static readonly RESPONCE_FORMAT_KEY = 'responce-format';
  // Hlavičky, které se odešlou na server společně s dotazem
  static readonly HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Charset': 'UTF-8'
  };
  // Formát dotazu
  static readonly BODY_FORMAT = 'query=';
  // Regulární výraz pro řetězec: "http://localhost:3030"
  static readonly LOCALHOST_REGEX = new RegExp('(http:\/\/)?localhost(:[0-9]+)?\/');
  // Sdílená statická továrna pro parsery odpovědi ze serveru
  static readonly SERVER_RESPONCE_FACTORY = new ServerResponceParserFactory();

  // Příznak, zda-li se zpracovává požadavek na server
  private _working: boolean;

  /**
   * Sestaví adresu odkazu, na který se bude posílat požadavek.
   * Pokud se jedná o produkční verzi, nebude se do adresy zasahovat a prostě se vrátí.
   *
   * Pokud se jedná o vývoj, je potřeba vyřešit CORS problém.
   * Pokud odesílám požadavek na localhost, dám prefix 'sendLocalRequest', jinak 'sendRemoteRequest'.
   * V souboru 'proxy.config.json' je pak podle těchto prefixů požadavek přesměrován.
   *
   * @param endpoint Adresa odkazu
   * @param useCorsHack True, pokud se má použít CORS hack
   * @param corsURL URL adresa pro CORS hack
   */
  private static _buildAddress(endpoint: string, useCorsHack: boolean, corsURL: string): string {
    // Zjistím, zda-li se jedná o produkční verzi aplikace
    const isProduction = environment.production;

    // Pokud se jedná o produkci, nebo nechci použít CORS hack,
    // (ne)upravím výslednou URL adresu
    if (isProduction || !useCorsHack) {
      // Pokud chci použít CORS hack, přidám před url adresu prefix,
      // jinak vrátím původní adresu
      return useCorsHack ? `${corsURL}/${endpoint}` : endpoint;
    }

    // Další věci se týkají pouze dev serveru
    // --------------------------------------

    // Dále zjistím, zda-li se server nachází na localhostu v případě dev verze
    const isLocalhost = endpoint.search(this.LOCALHOST_REGEX) !== -1;

    // Základní prefix pro odeslání požadavku počítá s odesláním přes externí adresu
    let prefix = 'sendRemoteRequest';
    // Pokud se jedná o localhost
    if (isLocalhost) {
      // Nastavím jiný prefix
      prefix = 'sendLocalRequest';
      // Přepíšu řetězec "http://localhost:3030" za prázdný řetězec
      endpoint = endpoint.replace(this.LOCALHOST_REGEX, '');
    }
    // Vrátím adresu, která se zpracuje v souboru "proxy.config.json
    return `${prefix}/${endpoint}`;
  }

  constructor(private _http: HttpClient, private _storage: LocalStorageService,
              private _qresultService: QueryResultService, private _settings: SettingsService) {
    this._working = false;
  }

  /**
   * Extrahuje proměnné z dotazu a dosadí za ně hodnoty
   *
   * @param query Dotaz, ve kterém se mají dosadit hodnoty
   */
  private _extractVariables(query: Query): string {
    let queryContent = query.content;
    for (const key of Object.keys(query.params)) {
      const param = <ParameterValue>query.params[key];
      const value = (param.usedValue !== undefined && param.usedValue !== '') ? param.usedValue : param.defaultValue;
      queryContent = queryContent.replace(
        `${this._settings.queryParameterFormat.prefix}${key}${this._settings.queryParameterFormat.suffix}`,
        value);
    }

    return queryContent;
  }

  /**
   * Uloží výsledek ze serveru
   *
   * @param qresult Instance výsledku odpovědi ze serveru
   */
  private _saveResponce(qresult: QueryResult) {
    this._storage.set(EndpointCommunicatorService.LAST_QUERY_KEY, JSON.stringify(qresult));
    this._qresultService.add(qresult);
  }

  /**
   * Vytvoří dotaz na server
   *
   * @param query Instance třídy {@link Query}, pro kterou se posílá požadavek na server
   * @param ignoreStatistics True, pokud se výsledek dotazu nemá započítávat do statistik, jinak False
   */
  makeRequest(query: Query, ignoreStatistics: boolean): Promise<QueryResult> {
    // Nastavím příznak, že komunikuji se serverem
    this._working = true;
    // Uložím si čas spuštění dotazu
    const start = query.lastRun;
    // Sestavení adresy, kam se bude odesílat dotaz
    const address = EndpointCommunicatorService._buildAddress(query.endpoint, this._settings.corsHack, this._settings.corsURL);
    // Zaloguji sestavenou adresu
    console.log(address);
    // Připravím si formát těla požadavku, který budu posílat na server
    // Sestavení těla dotazu - vyextrahování proměnných
    const body = `${EndpointCommunicatorService.BODY_FORMAT}${this._extractVariables(query)}`;
    // Zaloguji tělo dotazu
    console.log(body);
    // Vytvořím kopii objektu s hlavičkami
    const headers = JSON.parse(JSON.stringify(EndpointCommunicatorService.HEADERS));
    // Připojím hlavičku s definicí formátu odpovědi
    headers['Accept'] = ResponceFormat[this.responceFormat];
    headers['Timeout'] = this._settings.serverTimeout;

    // Budu vracet výsledek z dotazu jako Promise
    return this._http
    // POST požadavek na query.endpoint
    .post(address, body, {'headers': new HttpHeaders(headers), 'responseType': 'text'})
    // Převedu na Promise
    .toPromise()
    // Pokud se požadavek úspěšně vykoná a příjdou validní data
    .then(responce => {
      console.log('Přišla nějaká data.');
      console.log(responce);
      const end = Date.now();
      const responceParser = EndpointCommunicatorService.SERVER_RESPONCE_FACTORY
        .getResponceParser(query, responce, ResponceFormat[this.responceFormat]);
      const qresult = new QueryResult(query.id, query.name, query.content, responce, query.usedParams(),
        ResultState.OK, end, end - start, responceParser.countOfSelect(), responceParser.countOfConstruct(), this.responceFormat);
      // Pokud se má výsledek započítat do statistik
      if (!ignoreStatistics) {
        // Uložím výsledek
        this._saveResponce(qresult);
      }
      return qresult;
    })
    // Pokud se vykonání požadavku nezdařilo, v proměnné "reason" budu mít uložený důvod neúspěchu
    .catch((reason: HttpErrorResponse) => {
      console.log('Nastala nějaká chyba.');
      console.error(reason);
      const end = Date.now();
      const qresult = new QueryResult(query.id, query.name, query.content, reason.statusText, query.usedParams(),
        ResultState.KO, end, end - start, 0, 0, this.responceFormat);
      // Pokud se má výsledek započítat do statistik
      if (!ignoreStatistics) {
        // Zpracuji neúspěšný výsledek
        this._saveResponce(qresult);
      }
      // Vrátím důvod neúspěchu, aby se zobrazil v GUI
      return qresult;
    })
    // Nakonec zruším přízak, že komunikuji se serverem...
    .finally(() => {
      this._working = false;
    });
  }

  /**
   * Vrátí instanci výsledu posledního provedeného dotazu
   */
  get lastQueryResult(): QueryResult {
    const result = this._storage.get<string>(EndpointCommunicatorService.LAST_QUERY_KEY);
    if (result === null) {
      return undefined;
    }
    return parseQueryResult(<QueryResultStorageEntry>JSON.parse(result));
  }

  /**
   * Vrátí zkratku formátu odpovědi ze serveru
   */
  get responceFormat(): string {
    return (this._storage.get(EndpointCommunicatorService.RESPONCE_FORMAT_KEY) || 'JSON');
  }

  /**
   * Nastaví formát odpovědi podle zkratky
   *
   * @param format Zkratka formátu odpovědi. Může být jeden ze čtyř podporovaných formátů: {@link ResponceFormat}
   */
  set responceFormat(format: string) {
    this._storage.set(EndpointCommunicatorService.RESPONCE_FORMAT_KEY, format);
  }

  /**
   * Indikátor, který říká, zda-li se aktuálně zpracovává nějaký požadavek, či nikoliv
   */
  get working(): boolean {
    return this._working;
  }
}

