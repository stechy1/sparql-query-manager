import { EventEmitter, Injectable } from '@angular/core';
import { Query } from './query';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { IQueryCRUD } from './iquery-crud';
import { encodeQueries, parseQuery, QueryStorageEntry } from './query-storage-entry';

@Injectable({
  providedIn: 'root'
})
export class QueryService implements IQueryCRUD {

  // Konstanta obsahující název klíče, pod který se ukládají data o dotazech do local storage
  static readonly STORAGE_KEY = 'queries';

  // Kolekce dotazů
  private _queries = new Array<Query>();
  private _queryCollectionChange = new EventEmitter<QueryCollectionChange>();

  constructor(private _storage: LocalStorageService, private _settings: SettingsService) {
    this._loadQueries();
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
      const query = parseQuery(rawQuery);
      this._queries.push(query);
      this._queryCollectionChange.emit({typeOfChange: TypeOfQueryChange.ADD, query: query});
    }
  }

  /**
   * Načte data z localStorage
   */
  private _loadQueries(): void {
    const dataRaw = this._storage.get<QueryStorageEntry[]>(QueryService.STORAGE_KEY) || new Array<QueryStorageEntry>();
    this._loadQueriesInternal(dataRaw);
  }

  /**
   * Uloží data do localStorage
   */
  private _saveQueries(): void {
    this._storage.set(QueryService.STORAGE_KEY, encodeQueries(this._queries));
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
   * Vytvoří hlubokou kopii zadaného dotazu a uloží ho do paměti
   *
   * @param query Dotaz {@link Query}, který se má zduplikovat
   * @return ID nového dotazu
   */
  duplicate(query: Query): string {
    const newQuery = new Query(QueryService.makeID(), query.name + this._settings.suffixForDuplicatedQuery, query.endpoint,
      JSON.parse(JSON.stringify(query.tags)) || [], query.content, {}, query.description, Date.now(), 0, 0);
    newQuery.params = (JSON.parse(JSON.stringify(query.params)) || {});

    this._queries.push(newQuery);
    this._saveQueries();
    this._queryCollectionChange.emit({typeOfChange: TypeOfQueryChange.ADD, query: newQuery});

    return newQuery.id;
  }

  /**
   * Vygeneruje pole všech endpointů, které jsou v dotazech
   */
  endpoints(): string[] {
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
  tags(): string[] {
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
