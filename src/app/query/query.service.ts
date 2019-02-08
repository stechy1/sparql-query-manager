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
  _params: string[];
  _created: number;
  _lastRun: number;
  _runCount: number;
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
    return new Query(input._id, input._name, input._endpoint, input._tags, input._content, input._params,
      input._description, input._created, input._lastRun, input._runCount);
  }

  private static makeID(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Interní metoda pro načtení dotazů do paměti
   *
   * @param queries Pole dotazů
   */
  private _loadQueriesInternal(queries: QueryStorageEntry[]): void {
    for (const query of queries) {
      this._queries.push(QueryService.parseQuery(query));
    }
  }

  /**
   * Načte data z localStorage
   */
  private _loadQueries(): void {
    const dataRaw = this.storage.get<string>(QueryService.STORAGE_KEY) || '[]';
    const data = <QueryStorageEntry[]>JSON.parse(dataRaw);
    this._loadQueriesInternal(data);
  }

  /**
   * Uloží data do localStorage
   */
  private _saveQueries(): void {
    this.storage.set(QueryService.STORAGE_KEY, JSON.stringify(this._queries, Query.structureGuard));
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
    const query = new Query(QueryService.makeID(), name, endpoint, tags, content, variables, description, new Date().getTime(), null, 0);
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

  /**
   * Vynucení uložení dotazů na disk
   */
  performSave() {
    this._saveQueries();
  }

  /**
   * Serializuje vybrané dotazy do textové podoby
   *
   * @param queries Pole všech dotazů, které se budou exportovat
   */
  export(queries: Query[]): string {
    const result = JSON.stringify(queries, Query.structureGuard);
    this._queries.forEach(value => value.selected = false);
    return result;
  }

  /**
   * Importuje dotazy
   *
   * @param text Serializované dotazy
   * @param override True, pokud importované dotazy mají přepsat lokální databázi, jinak false
   */
  import(text: string, override: boolean) {
    if (override) {
      this._queries.splice(0, this._queries.length);
      this._loadQueriesInternal(JSON.parse(text));
    } else {
      this._loadQueriesInternal(JSON.parse(text));
    }

    this._saveQueries();
  }

  /**
   * Vymaže celou lokální databázi
   */
  clear() {
    this._queries.splice(0, this._queries.length);
    this._saveQueries();
  }

  get endpoints(): string[] {
    const endpointArray: string[] = [];
    this._queries.forEach(query => {
      endpointArray.push(query.endpoint);
    });

    return endpointArray
    .filter(((value, index, array) => array.indexOf(value) === index))
    .sort((a, b) => a.localeCompare(b));
  }

  get tags(): string[] {
    const tagArray: string[] = [];
    this._queries.forEach(query => {
      query.tags.forEach(tag => {
        tagArray.push(tag);
      });
    });

    return tagArray
    .filter(((value, index, array) => array.indexOf(value) === index))
    .sort((a, b) => a.localeCompare(b));
  }
}
