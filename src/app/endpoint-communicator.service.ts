import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Query } from './query/query';
import { QueryResultService } from './query-result/query-result.service';
import { QueryResult, ResultState } from './query-result/query-result';

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
   * Zpracuje výsledek ze serveru
   *
   * @param responce Odpověď serveru, nebo chybová hláčka
   * @param resultState Výsledek odpovědi: OK/KO
   * @param query Instance třídy Query, pro kterou byla odpověď získána
   * @param start Čas začátku volání serveru
   */
  private _handleRequestResult(responce: string | {}, resultState: ResultState, query: Query, start: number) {
    const end = Date.now();
    this._storage.set(EndpointCommunicatorService.LAST_QUERY_KEY, responce);
    this._storage.set(EndpointCommunicatorService.LAST_QUERY_BODY_KEY, query.content);
    const qresult = new QueryResult(query.id, query.name, query.content, responce, query.usedParams(),
      resultState, end, end - start, 0, 0);
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
    .post(query.endpoint, body, {'headers': new HttpHeaders(headers)})
    // Převedu na Promise
    .toPromise()
    // Pokud se požadavek úspěšně vykoná a příjdou validní data
    .then(responce => {
      console.log('Přišla nějaká data.');
      console.log(responce);
      // Pokud se má výsledek započítat do statistik
      if (!ignoreStatistics) {
        // Zpracuji výsledek se stavem OK
        this._handleRequestResult(responce, ResultState.OK, query, start);
      }
      return responce;
    })
    // Pokud se vykonání požadavku nezdařilo, v proměnné "reason" budu mít uložený důvod neúspěchu
    .catch((reason: HttpErrorResponse) => {
      console.log('Nastala nějaká chyba.');
      console.error(JSON.stringify(reason));
      // Pokud se má výsledek započítat do statistik
      if (!ignoreStatistics) {
        // Zpracuji neúspěšný výsledek
        this._handleRequestResult(reason.statusText, ResultState.KO, query, start);
      }
      // Vrátím důvod neúspěchu, aby se zobrazil v GUI
      return reason.statusText;
    })
    // Nakonec zruším přízak, že komunikuji se serverem...
    .finally(() => {
      this._working = false;
    });
  }

  /**
   * Vrátí poslední výsledek dotazu
   */
  get lastQueryResult(): {} {
    return this._storage.get(EndpointCommunicatorService.LAST_QUERY_KEY) || {};
  }

  /**
   * Vrátí tělo posledního dotazu
   */
  get lastQueryBody(): string {
    return this._storage.get(EndpointCommunicatorService.LAST_QUERY_BODY_KEY) || '';
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
