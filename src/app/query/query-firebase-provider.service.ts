import { QueryCollectionChange, QueryStorageProvider, TypeOfQueryChange } from './query-storage-provider';
import { Observable, Subject, Subscription } from 'rxjs';
import { Query } from './query';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { encodeQuery, parseQuery, QueryStorageEntry } from './query-storage-entry';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QueryFirebaseProviderService implements QueryStorageProvider {

  // Název kolekce, která obsahuje dotazy ve Firebase
  static readonly QUERY_COLLECTION = 'queries';

  // Reference na kolekci s dotazy
  private readonly _queriesCollection: AngularFirestoreCollection<QueryStorageEntry>;
  // Subjekt pomocí kterého se informuje okolní svět, že se přidala aktualizovaly kolekce
  private readonly _querySubject: Subject<QueryCollectionChange> = new Subject();

  // Subscription
  private _queriesSubscription: Subscription;
  // Lokální kopie dotazů ve Firebase
  private _queries: Query[] = [];

  constructor(private readonly _db: AngularFirestore) {
    console.log('Připojuji se k firebase...');
    // Získání reference na kolekci dotazů z Firebase
    this._queriesCollection = this._db.collection<QueryStorageEntry>(QueryFirebaseProviderService.QUERY_COLLECTION);
  }

  /**
   * Přihlásí se k odběru změn dotazů
   */
  private _subscribeQueries() {
    const self = this;
    // Zajímají mne pouze případy, kdy je dotaz přidán, nebo odebrán
    this._queriesSubscription = this._queriesCollection.snapshotChanges(['added', 'removed'])
    // Přidám nějaký ten postprocessing
    .pipe(
      // V tomto případě se jedná o mapování z jedné hodnoty na druhou
      map(actions => actions.map(value => {
        // Uložím si ID dotazu
        const id = value.payload.doc.id;
        // Vyzvednu si data
        const data = value.payload.doc.data() as QueryStorageEntry;
        // Uložím ID
        data._id = id;
        // Pokusím se najít dotaz se stejným ID v lokální kolekci
        const index = this._queries.findIndex(val => val.id === id);
        // Pokud záznam existuje
        if (index !== -1) {
          // Nebudu nic provádět
          return id;
        }
        console.log('Přidávám query.');
        console.log(data);
        // Naparsuji dotaz
        const query = parseQuery(data, true);
        query.uploaded = true;
        // Uložím ho do lokální kolekce
        self._queries.push(query);
        // Inform rest of the worl, that new query arrived
        self._querySubject.next({query: query, typeOfChange: TypeOfQueryChange.ADD});
        // Vrátím ID dotazu
        return id;
      })))
    // liveIDs obsahuje pole ID dotazů, které již existují v lokální kopii
    .subscribe((liveIDs: string[]) => {
      // Vytvořím pole ID lokálních dotazů
      const localIDs = this._queries.map(query => query.id);
      // Vytvořím set ID aktuálních dotazů
      const liveSetIDs = new Set(liveIDs);
      // Získám Set, obsahující ID smazaných dotazů (localIDs - liveSetIDs)
      const diffIDs = localIDs.filter(x => !liveSetIDs.has(x));
      // O smazaných dotazech musím informovat zbytek světa
      for (const id of diffIDs) {
        // Najdu index dotazu, který chci smazat
        const index = this._queries.findIndex(query => query.id === id);
        // Uložím si referenci na mazaný dotaz
        const deletedQuery = this._queries[index];
        // Smažu dotaz z lokální kopie dotazů
        this._queries.splice(index, 1);
        // Informuji svět, že jsem smazal dotaz
        this._querySubject.next({query: deletedQuery, typeOfChange: TypeOfQueryChange.REMOVE});
      }
    });
  }

  /**
   * Odhlásí se z odběru změn dotazů
   */
  private _unsubscribeQueries() {
    this._queriesSubscription.unsubscribe();
  }

  load(): void {
    this._subscribeQueries();
  }

  save(): Promise<void> {
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    return this._queriesCollection.doc(id).delete();
  }

  insert(query: Query): Promise<string> {
    return this._queriesCollection.doc(query.id).set(encodeQuery(query)).then(() => query.id);
  }

  observable(): Observable<QueryCollectionChange> {
    return this._querySubject;
  }
}
