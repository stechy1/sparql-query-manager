import { EventEmitter, Injectable } from '@angular/core';
import { Query } from './query';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs';

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

  // Konstanta obsahující název klíče, pod který se ukládají data o dotazech do local storage
  static readonly STORAGE_KEY = 'queries';

  // Kolekce dotazů
  private _queries = new Array<Query>();
  private _queryCollectionChange = new EventEmitter<QueryCollectionChange>();

  constructor(private storage: LocalStorageService) {
    this._loadQueries();
  }

  /**
   * Metoda převede vstup na Query
   *
   * @param input Naparsovaný dotaz
   */
  private static parseQuery(input: QueryStorageEntry): Query {
    return new Query(input._id, input._name, input._endpoint, input._tags, input._content, input._params,
      input._description, input._created, input._lastRun, input._runCount);
  }

  /**
   * Generátor náhodného ID dotazu
   */
  private static makeID(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Interní metoda pro načtení dotazů do paměti
   *
   * @param queries Pole dotazů
   */
  private _loadQueriesInternal(queries: QueryStorageEntry[]): void {
    for (const rawQuery of queries) {
      const query = QueryService.parseQuery(rawQuery);
      this._queries.push(query);
      this._queryCollectionChange.emit({typeOfChange: TypeOfQueryChange.ADD, query: query});
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
   * Vytvoří nový prázdný dotaz
   */
  create() {
    const query = new Query(QueryService.makeID(), '', '', [], '', {}, '', new Date().getTime(), null, 0);
    this._queries.push(query);
    this._saveQueries();
    this._queryCollectionChange.emit({typeOfChange: TypeOfQueryChange.ADD, query: query});
    return query.id;
  }

  /**
   * Odstraní záznam podle ID
   *
   * @param id ID záznamu, který se má odstranit
   */
  delete(id: string) {
      const index = this._queries.findIndex(value => value.id === id);
      if (index === -1) {
        return;
      }

      const query = this._queries[index];
      this._queries.splice(index, 1);
      this._saveQueries();
      this._queryCollectionChange.emit({typeOfChange: TypeOfQueryChange.REMOVE, query: query});
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
    }

    this._loadQueriesInternal(JSON.parse(text));

    this._saveQueries();
  }

  /**
   * Vymaže celou lokální databázi
   */
  clear() {
    this._queries.splice(0, this._queries.length);
    this._saveQueries();
    this._queryCollectionChange.emit({typeOfChange: TypeOfQueryChange.CLEAR, query: undefined});
  }

  /**
   * Vygeneruje pole všech endpointů, které jsou v dotazech
   */
  get endpoints(): string[] {
    const endpointArray: string[] = [];
    this._queries.forEach(query => {
      endpointArray.push(query.endpoint);
    });

    return endpointArray
    .filter(((value, index, array) => array.indexOf(value) === index))
    .sort((a, b) => a.localeCompare(b));
  }

  /**
   * Vygeneruje pole všech tagů, které jsou v dotazech
   */
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

  get collectionChange(): Observable<QueryCollectionChange> {
    return this._queryCollectionChange.asObservable();
  }
}

export enum TypeOfQueryChange {
  ADD, REMOVE, CLEAR
}

export interface QueryCollectionChange {
  typeOfChange: TypeOfQueryChange;
  query: Query;
}
