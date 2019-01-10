import { Injectable } from '@angular/core';
import { Query } from './query';
import { LocalStorageService } from 'angular-2-local-storage';

interface QueryStorageEntry {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  static readonly STORAGE_KEY = 'queries';

  private _queries = new Array<Query>();

  constructor(private storage: LocalStorageService) {
    this._loadQueries();
  }

  private static parseQuery(input: QueryStorageEntry): Query {
    return new Query(input.id, input.name, input.endpoint, input.content, input.description);
  }

  /**
   * Načte data z localStorage
   */
  private _loadQueries(): void {
    const dataRaw = this.storage.get<string>(QueryService.STORAGE_KEY) || '';
    const data = <QueryStorageEntry[]> JSON.parse(dataRaw);

    for (const query of data) {
      console.log(query);
      this._queries.push(QueryService.parseQuery(query));
    }
  }

  /**
   * Uloží data do localStorage
   */
  private _saveQueries(): void {
    this.storage.set(QueryService.STORAGE_KEY, JSON.stringify(this._queries));
  }

  /**
   * Vrátí kolekci všech dotazů
   */
  allQueries(): Query[] {
    return this._queries;
  }

  /**
   * Najde dotaz podle ID
   *
   * @param id ID dotazu, který se má vrátit
   */
  byId(id: string): Query {
    return this._queries.find(query => id === query.id);
  }
}
