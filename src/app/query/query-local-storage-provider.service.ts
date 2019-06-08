import { QueryCollectionChange, QueryStorageProvider, TypeOfQueryChange } from './query-storage-provider';
import { Observable, Subject } from 'rxjs';
import { Query } from './query';
import { Injectable } from '@angular/core';
import { encodeQueries, parseQuery, QueryStorageEntry } from './query-storage-entry';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable({
  providedIn: 'root'
})
export class QueryLocalStorageProviderService implements QueryStorageProvider {

  // Název služby
  public static readonly QUERY_PROVIDER_NAME = 'local_storage_provider';
  // Konstanta obsahující název klíče, pod který se ukládají data o dotazech do local storage
  static readonly STORAGE_KEY = 'queries';

  // Subjekt pomocí kterého se informuje okolní svět, že se přidala aktualizovaly kolekce
  private readonly _querySubject: Subject<QueryCollectionChange> = new Subject();

  // Lokální kopie dotazů v LocalStorage
  private _queries: Query[] = [];

  constructor(private _storage: LocalStorageService) {}

  /**
   * Interní metoda pro načtení dotazů do paměti
   *
   * @param queries Pole dotazů
   */
  private _loadQueriesInternal(queries: QueryStorageEntry[]): void {
    const iterator = queries.entries();
    this._delayLoad(iterator);
    // for (const rawQuery of queries) {
    //   const query = parseQuery(rawQuery);
    //   query.downloaded = true;
    //   this._queries.push(query);
    //   this._querySubject.next({query: query, typeOfChange: TypeOfQueryChange.ADD});
    // }
  }

  /**
   * Zpožděné načítání výsledků
   *
   * @param iterator Iterator pole dotazů
   */
  private _delayLoad(iterator: IterableIterator<[number, QueryStorageEntry]>) {
    const entry = iterator.next();
    if (entry.done) {
      return;
    }

    const query = parseQuery(entry.value[1]);
    query.downloaded = true;
    this._queries.push(query);
    this._querySubject.next({query: query, typeOfChange: TypeOfQueryChange.ADD});
    setTimeout(() => this._delayLoad(iterator), 100);
  }

  /**
   * Načte data z localStorage
   */
  private _loadQueries(): void {
    const dataRaw = this._storage.get<QueryStorageEntry[]>(QueryLocalStorageProviderService.STORAGE_KEY) || new Array<QueryStorageEntry>();
    this._loadQueriesInternal(dataRaw);
  }

  /**
   * Uloží data do localStorage
   */
  private _saveQueries(): void {
    this._storage.set(QueryLocalStorageProviderService.STORAGE_KEY, encodeQueries(this._queries));
  }

  load(): void {
    this._loadQueries();
  }

  save(): Promise<void> {
    return new Promise<void>(resolve => {
      this._saveQueries();
      resolve();
    });
  }

  insert(query: Query): Promise<string> {
    return new Promise<string>(resolve => {
      const index = this._queries.findIndex(value => value.id === query.id);
      if (index !== -1) {
        resolve(null);
        return;
      }
      this._queries.push(query);
      this._saveQueries();
      this._querySubject.next({typeOfChange: TypeOfQueryChange.ADD, query: query});
      resolve(query.id);
    });
  }

  delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const index = this._queries.findIndex(query => query.id === id);
      if (index === -1) {
        reject();
        return;
      }

      const deletedQuery = this._queries[index];
      this._queries.splice(index, 1);
      this._saveQueries();
      this._querySubject.next({
        query: deletedQuery,
        typeOfChange: TypeOfQueryChange.REMOVE,
        source: QueryLocalStorageProviderService.QUERY_PROVIDER_NAME
      });
    });
  }

  observable(): Observable<QueryCollectionChange> {
    return this._querySubject;
  }
}
