import { Injectable } from '@angular/core';
import { Query } from './query';
import { LocalStorageService } from 'angular-2-local-storage';

interface QueryStorageEntry {
  _id: string;
  _name: string;
  _description: string;
  _tags: string[];
  _endpoint: string;
  _content: string;
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
    return new Query(input._id, input._name, input._endpoint, input._tags, input._content, input._description);
  }

  private static makeID(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Načte data z localStorage
   */
  private _loadQueries(): void {
    const dataRaw = this.storage.get<string>(QueryService.STORAGE_KEY) || '[]';
    const data = <QueryStorageEntry[]>JSON.parse(dataRaw);

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

  /**
   * Vytvoří záznam o novém dotazu
   *
   * @param name Název dotazu
   * @param endpoint Endpoint, na který se bude dotaz posílat
   * @param description Popis dotazu
   * @param tags Seznam tagů, které odpovídají danému dotazu
   * @param content Obsah samotného dotazu
   * @param variables Proměnné, které se vyskytují v dotazu
   */
  create(name: string, endpoint: string, description: string, tags: string[], content: string, variables: {}) {
    const query = new Query(QueryService.makeID(), name, endpoint, tags, content, description);
    this._queries.push(query);
    this._saveQueries();
  }

  /**
   * Odstraní záznam podle ID
   *
   * @param id ID záznamu, který se má odstranit
   */
  delete(id: string) {
    const index = this._queries.findIndex(value => value.id === id);
    this._queries.splice(index, 1);
    this._saveQueries();
  }
}
