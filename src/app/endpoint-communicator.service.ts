import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { endpointsMock } from './endpoints-mock';
import { LocalStorageService } from 'angular-2-local-storage';
import { Query } from './query/query';
import { QueryResultService } from './query-result/query-result.service';
import { QueryResult, ResultState } from './query-result/query-result';

@Injectable({
  providedIn: 'root'
})
export class EndpointCommunicatorService {

  static readonly LAST_QUERY_KEY = 'last-query';
  static readonly LAST_QUERY_BODY_KEY: 'last-query-body';

  static readonly OPTIONS = {
    'headers': new HttpHeaders({
      'Accept': 'application/sparql-results+json,*/*;q=0.9',
      'Content-Type' : 'application/x-www-form-urlencode',
      'Charset': 'UTF-8',
    })
  };

  constructor(private _http: HttpClient, private _storage: LocalStorageService,
              private _qresultService: QueryResultService) { }

  makeRequest(query: Query): Promise<any> {
    const start = query.lastRun;
    return new Promise<any>(resolve => {
      setTimeout(() => {
        const end = Date.now();
        this._storage.set(EndpointCommunicatorService.LAST_QUERY_KEY, endpointsMock);
        this._storage.set(EndpointCommunicatorService.LAST_QUERY_BODY_KEY, query.content);
        const qresult = new QueryResult(query.id, query.name, query.content, endpointsMock, query.usedParams(),
          ResultState.OK, end, end - start, 0, 0);
        this._qresultService.add(qresult);
        resolve(endpointsMock);
      }, 1000 + Math.random() * 10000);
    });

    // TODO po vyřešení cors problému vrátit zpět opravdové odesílání dotazů
    // const formData = new FormData();
    // formData.append('query', query.content);
    // return this._http
    //   .post(query.endpoint, formData, EndpointCommunicatorService.OPTIONS)
    //   .toPromise();
      // .then(value => console.log(value));
  }

  get lastQueryResult(): {} {
    return this._storage.get(EndpointCommunicatorService.LAST_QUERY_KEY) || {};
  }

  get lastQueryBody(): string {
    return this._storage.get(EndpointCommunicatorService.LAST_QUERY_BODY_KEY) || '';
  }

}
