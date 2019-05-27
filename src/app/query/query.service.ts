import { QueryLocalStorageProviderService } from './query-local-storage-provider.service';
import { QueryFirebaseProviderService } from './query-firebase-provider.service';
import { Injectable } from '@angular/core';
import { Query } from './query';
import { QueryCollectionChange, TypeOfQueryChange } from './query-storage-provider';
import { SettingsService } from '../settings/settings.service';
import { Observable, Subject } from 'rxjs';
import { parseQuery, QueryStorageEntry } from './query-storage-entry';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  // Subjekt, pomocí kterého se propagují změny v kolekci dále do světa
  private readonly _querySubject = new Subject<QueryCollectionChange>();
  // Kolekce všech existujících dotazů v aplikaci
  private readonly _queries: Query[] = [];

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

  /**
   * Metoda pro zpracování změny v kolekci dotazů
   *
   * @param change Změna v kolekci dotazů
   */
  private _processQuery(change: QueryCollectionChange) {
    // Definuji pomocnou proměnnou, která říká, zda-li mám nechat "probublat" událost k dalšímu zpracování
    let continueProcessing = true;
    // Podle typu akce se zachovám
    switch (change.typeOfChange) {
      // V případě přidání nového dotazu
      case TypeOfQueryChange.ADD: {
        // Pokusím se najít index dotazu v aktuální kolekci
        const index = this._queries.findIndex(query => query.id === change.query.id);
        // Pokud takový dotaz neexistuje,
        if (index === -1) {
          // tak ho přidám do kolekce a o víc se nestarám
          this._queries.push(change.query);
          // Opustím switch
          break;
        }

        // Zde mám jistotu, že dotaz existuje
        continueProcessing = false;
        // Získám si instanci z aktuální kolekce
        const localQuery = this._queries[index];
        // To, že dotaz existuje znamená, že byl již jednou přídán
        // ať už z localStorage, nebo z firebase
        // naštěstí pro mě, tohle řešit nemusím a prostě
        // nastavím dotazu parametry "downloaded" a "uploaded" na true
        // change.query.downloaded = change.query.uploaded = true;
        localQuery.downloaded = localQuery.uploaded = true;
      }
        // Opustím switch
        break;
      // V případě odebrání dotazu
      case TypeOfQueryChange.REMOVE: {
        // Získám instanci odebraného dotazu
        const index = this._queries.findIndex(query => query.id === change.query.id);
        // Vytáhnu si referenci dotazu z aktuální kolekce
        const affectedQuery = this._queries[index];

        // Pokud byl dotaz uložen i nahrán zároveň
        if (affectedQuery.downloaded && affectedQuery.uploaded) {
          // Podle zdroje odstranění dotazu
          switch (change.source) {
            // Odstranil jsem dotaz z localStorage
            case QueryLocalStorageProviderService.QUERY_PROVIDER_NAME:
              // Nastavím příznak "downloaded" na false
              affectedQuery.downloaded = false;
              break;
            // Odstranil jsem dotaz z firebase
            case QueryFirebaseProviderService.QUERY_PROVIDER_NAME:
              // Nastavím příznak "uploaded" na false
              affectedQuery.uploaded = false;
              // Opustím switch
              break;
          }
          // Přeruším propagování dalšího zpracování
          continueProcessing = false;
          // Opustím switch
          break;
        }
        // Dotaz byl buď stažený, nebo nahraný, takže ho můžu bezpečně odstranit
        // protože již neexistuje ani v jednom úložišti
        this._queries.splice(index, 1);
      }
        // Opustím switch
        break;
      case TypeOfQueryChange.CLEAR:
        this._queries.splice(0, this._queries.length - 1);
        break;
    }

    // Pokud můžu pokračovat ve zpracování změny
    if (continueProcessing) {
      // Nechám probublat změnu do dalšího kola
      this._querySubject.next(change);
    }
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
      if (result === undefined || (result.uploaded && !result.downloaded) || !result.downloaded) {
        reject();
      }

      resolve(result);
    });
  }

  /**
   * Vytvoří nový prázdný dotaz
   */
  create(query?: Query): Promise<string> {
    if (query === undefined) {
      query = new Query(QueryService.makeID(), '', '', [], '', {}, '', new Date().getTime(), null, 0);
      return this._queryLocalStorageProvider.insert(query);
    }

    return query.uploaded
      ? this._queryLocalStorageProvider.insert(query)
      : this._queryFirebaseProvider.insert(query);
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

  /**
   * Provede uložení pouze localStorage
   * Firebase je synchronizována průběžně
   */
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
      return value.uploaded
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
    return new Promise<string>(resolve => {
      const result = JSON.stringify(queries.filter(query => query.downloaded), Query.structureGuard);
      this._queries.forEach(value => value.selected = false);
      resolve(result);
    });
  }

  /**
   * Importuje dotazy
   *
   * @param text Serializované dotazy
   * @param override True, pokud importované dotazy mají přepsat lokální databázi, jinak false
   */
  import(text: string, override: boolean): Promise<number> {
    return new Promise<number>(resolve => {
      // Inicializuji pomocnou proměnnou
      let clear = Promise.resolve();
      if (override) {
        // Pokud mám přepsat celou lokální databázi, tak ji musím nejdříve vymazat
        clear = this.clear(false);
      }
      // Po vymazání (pokud nějaké nastalo)
      return clear.then(() => {
        // Naprasuji text do pole typu "QueryStorageEntry
        const queryEntries = JSON.parse(text) as QueryStorageEntry[];
        const count = queryEntries.length;
        // Vytvořím novou promise ze všech insertů:
        Promise.all(queryEntries
          // Projdu jednotlivé dotazy a každý vložím standartním způsobem
          .map(query => this._queryLocalStorageProvider.insert(parseQuery(query))))
          // Nakonec zavolám "resolve" nad hlavní promisou.
          .then(() => resolve(count));
      });
    });
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
