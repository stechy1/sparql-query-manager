import { QueryLocalStorageProviderService } from './query-local-storage-provider.service';
import { QueryFirebaseProviderService } from './query-firebase-provider.service';
import { Injectable } from '@angular/core';
import { Query } from './query';
import { QueryCollectionChange, TypeOfQueryChange } from './query-storage-provider';
import { SettingsService } from '../settings/settings.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  private readonly _querySubject = new Subject<QueryCollectionChange>();

  private _queries: Query[] = [];

  constructor(private _queryLocalStorageProvider: QueryLocalStorageProviderService,
              private _queryFirebaseProvider: QueryFirebaseProviderService,
              private _settings: SettingsService) {

    this._queryLocalStorageProvider.observable().subscribe(value => this._processQuery(value));
    this._queryFirebaseProvider.observable().subscribe(value => this._processQuery(value));

    this._queryLocalStorageProvider.load();
    this._queryFirebaseProvider.load();
  }

  /**
   * Generátor náhodného ID dotazu
   */
  private static makeID(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  private _processQuery(change: QueryCollectionChange) {
    switch (change.typeOfChange) {
      case TypeOfQueryChange.ADD:
        this._queries.push(change.query);
        break;
      case TypeOfQueryChange.REMOVE:
        const index = this._queries.findIndex(query => query.id === change.query.id);
        this._queries.splice(index, 1);
        break;
      case TypeOfQueryChange.CLEAR:
        this._queries.splice(0, this._queries.length - 1);
        break;
    }

    this._querySubject.next(change);
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
  byId(id: string): Promise<Query> {
    return new Promise<Query>((resolve, reject) => {
      const result = this._queries.find(query => id === query.id);
      if (result === undefined || result.isRemote) {
        reject();
      }

      resolve(result);
    });
  }

  /**
   * Vytvoří nový prázdný dotaz
   */
  create(): Promise<string> {
    const query = new Query(QueryService.makeID(), '', '', [], '', {}, '', new Date().getTime(), null, 0);
    return this._queryLocalStorageProvider.insert(query);
  }

  /**
   * Odstraní záznam podle ID
   *
   * @param id ID záznamu, který se má odstranit
   * @param remote True, pokud se bude mazat z firebase, False pro smazání z localStorage
   */
  delete(id: string, remote: boolean = false): Promise<void> {
    return remote
      ? this._queryFirebaseProvider.delete(id)
      : this._queryLocalStorageProvider.delete(id);
  }

  performSave() {
    this._queryLocalStorageProvider.save();
  }

  /**
   * Vymaže celou lokální databázi
   *
   * @param remote True, pokud se má smazat i data z Firebase
   */
  clear(remote: boolean = false): Promise<void> {
    return Promise.all(this._queries.map(value => {
      return value.isRemote
        ? remote
          ? this._queryFirebaseProvider.delete(value.id)
          : Promise.resolve()
        : this._queryLocalStorageProvider.delete(value.id);
    })).then(() => null);
  }

  /**
   * Vytvoří hlubokou kopii zadaného dotazu a uloží ho do paměti
   *
   * @param query Dotaz {@link Query}, který se má zduplikovat
   * @return ID nového dotazu
   */
  duplicate(query: Query): Promise<string> {
    const newQuery = new Query(QueryService.makeID(), query.name + this._settings.suffixForDuplicatedQuery, query.endpoint,
      JSON.parse(JSON.stringify(query.tags)) || [], query.content, {}, query.description, Date.now(), 0, 0);
    newQuery.params = (JSON.parse(JSON.stringify(query.params)) || {});

    return this._queryLocalStorageProvider.insert(newQuery);
  }

  /**
   * Serializuje vybrané dotazy do textové podoby
   *
   * @param queries Pole všech dotazů, které se budou exportovat
   */
  export(queries: Query[]): Promise<string> {
    return Promise.resolve('');
    // return new Promise<string>(resolve => {
    //   const result = JSON.stringify(queries, Query.structureGuard);
    //   this._queries.forEach(value => value.selected = false);
    //   resolve(result);
    // });
  }

  /**
   * Importuje dotazy
   *
   * @param text Serializované dotazy
   * @param override True, pokud importované dotazy mají přepsat lokální databázi, jinak false
   */
  import(text: string, override: boolean): Promise<void> {
    return Promise.resolve();
    // return new Promise<void>(resolve => {
    //   if (override) {
    //     this._queries.splice(0, this._queries.length);
    //     this._querySubject.next(this._queries);
    //   }
    //
    //   this._loadQueriesInternal(JSON.parse(text));
    //
    //   this._saveQueries();
    //   resolve();
    // });
  }

  /**
   * Vygeneruje pole všech endpointů, které jsou v dotazech
   */
  get endpoints(): string[] {
    const endpointArray = this._queries.map(query => query.endpoint);

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
    return this._querySubject;
  }
}
