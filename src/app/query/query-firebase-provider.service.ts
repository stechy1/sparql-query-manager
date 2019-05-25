import { QueryCollectionChange, QueryStorageProvider, TypeOfQueryChange } from './query-storage-provider';
import { Observable, Subject, Subscription } from 'rxjs';
import { Query } from './query';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeType } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { encodeQuery, parseQuery, QueryStorageEntry } from './query-storage-entry';
import { map} from 'rxjs/operators';

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
        // Zjistím, o jakou akci se jedná
        const action: DocumentChangeType = value.type;

        switch (action) {
          case 'added':
            // Vyzvednu si data
            const data = value.payload.doc.data() as QueryStorageEntry;
            // Uložím ID
            data._id = id;
            // Pokusím se najít dotaz se stejným ID v lokální kolekci
            const index = this._queries.findIndex(val => val.id === id);
            // Pokud záznam existuje
            if (index !== -1) {
              // Nebudu nic provádět
              break;
            }
            console.log('Přidávám query.');
            console.log(data);
            // Naparsuji dotaz
            const query = parseQuery(data, true);
            // Uložím ho do lokální kolekce
            self._queries.push(query);
            // Inform rest of the worl, that new query arrived
            self._querySubject.next({query: query, typeOfChange: TypeOfQueryChange.ADD});
            break;
          case 'removed':
            // TODO vymyslet, proč se tohle nevolá...
            console.log('Odstranuji query s id: ' + id);
            break;
          default:
            console.log('Nepodporovaná akce');
        }
      }))
    )
    .subscribe();
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
