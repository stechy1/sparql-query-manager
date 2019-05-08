import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Query } from './query/query';
import { QueryResultService } from './query-result/query-result.service';
import { QueryResult, ResultState } from './query-result/query-result';
import { parseQueryResult, QueryResultStorageEntry } from './query-result/query-result-storage.entry';

@Injectable({
  providedIn: 'root'
})
export class EndpointCommunicatorService {

  static readonly LAST_QUERY_KEY = 'last-query';
  static readonly LAST_QUERY_BODY_KEY = 'last-query-body';
  static readonly RESPONCE_FORMAT_KEY = 'responce-format';
  // Hlavičky, které se odešlou na server společně s dotazem
  static readonly HEADERS = {
    // 'Accept': 'application/sparql-results+json,*/*;q=0.9',
    // 'Content': 'application/json',
    // 'Accept': 'text/csv',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Charset': 'UTF-8',
    'Timeout': '5000'
  };
  // Formát dotazu
  static readonly BODY_FORMAT = 'query=';

  // Příznak, zda-li se zpracovává požadavek na server
  private _working: boolean;

  constructor(private _http: HttpClient, private _storage: LocalStorageService,
              private _qresultService: QueryResultService) {
    this._working = false;
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
  makeRequest(query: Query, ignoreStatistics: boolean): Promise<any> {
    // Nastavím příznak, že komunikuji se serverem
    this._working = true;
    // Uložím si čas spuštění dotazu
    const start = query.lastRun;
    // Připravím si formát těla požadavku, který budu posílat na server
    const body = `${EndpointCommunicatorService.BODY_FORMAT}${query.content}`;
    // Vytvořím kopii objektu s hlavičkami
    const headers = JSON.parse(JSON.stringify(EndpointCommunicatorService.HEADERS));
    // Připojím hlavičku s definicí formátu odpovědi
    headers['Accept'] = ResponceFormat[this.responceFormat];

    // Budu vracet výsledek z dotazu jako Promise
    return this._http
    // POST požadavek na query.endpoint
    .post(query.endpoint, body, {'headers': new HttpHeaders(headers), 'responseType': 'text'})
    // Převedu na Promise
    .toPromise()
    // Pokud se požadavek úspěšně vykoná a příjdou validní data
    .then(responce => {
      console.log('Přišla nějaká data.');
      console.log(responce);
      const end = Date.now();
      const qresult = new QueryResult(query.id, query.name, query.content, responce, query.usedParams(),
        ResultState.OK, end, end - start, 0, 0, this.responceFormat);
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
    return parseQueryResult(<QueryResultStorageEntry>JSON.parse(this._storage.get(EndpointCommunicatorService.LAST_QUERY_KEY)));
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

export enum ResponceFormat {
  JSON= 'application/sparql-results+json,*/*;q=0.9',
  XML= 'application/sparql-results+xml',
  CSV= 'text/csv',
  TSV= 'text/tab-separated-values'
}
