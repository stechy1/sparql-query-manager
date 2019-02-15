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

  static readonly options = {
    'headers': new HttpHeaders({
      'Accept': 'application/sparql-results+json,*/*;q=0.9',
      'Content-Type' : 'application/x-www-form-urlencode',
      'Charset': 'UTF-8',
    })
  };

  constructor(private _http: HttpClient, private _storage: LocalStorageService,
              private _qresultService: QueryResultService) { }

  makeRequest(query: Query): Promise<any> {
    const start = Date.now();
    return new Promise<any>(resolve => {
      setTimeout(() => {
        const end = Date.now();
        this._storage.set(EndpointCommunicatorService.LAST_QUERY_KEY, endpointsMock);
        const qresult = new QueryResult(query.id, query.name, query.content, query.usedParams(),
          ResultState.OK, end, end - start, 0, 0);
        this._qresultService.add(qresult);
        resolve(endpointsMock);
      }, 1000 + Math.random() * 10000);
    });

    // TODO po vyřešení cors problému vrátit zpět opravdové odesílání dotazů
    // const formData = new FormData();
    // formData.append('query', query);
    // this._http
    //   .post('http://cors.io/?' + endpoint, formData, EndpointCommunicatorService.options)
    //   .toPromise()
    //   .then(value => console.log(value));
  }

  get lastQueryResult(): any {
    return this._storage.get(EndpointCommunicatorService.LAST_QUERY_KEY) || '';
  }

}
