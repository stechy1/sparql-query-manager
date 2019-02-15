import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { endpointsMock } from './endpoints-mock';
import { LocalStorageService } from 'angular-2-local-storage';

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

  constructor(private _http: HttpClient, private _storage: LocalStorageService) { }

  makeRequest(endpoint: string, query: string): Promise<any> {
    return new Promise<any>(resolve => {
      setTimeout(() => {
        this._storage.set(EndpointCommunicatorService.LAST_QUERY_KEY, endpointsMock);
        resolve(endpointsMock);
      }, 1000);
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
