import { Query } from './query';
import { Observable } from 'rxjs';

export interface QueryStorageProvider {

  /**
   * Načte dotazy z úložiště
   *
   * @return Observable<Query[]> Pozorovatelnou kolekci s dotazy
   */
  load(): void;

  /**
   * Uloží všechny dotazy do úložiště
   */
  save(): Promise<void>;

  /**
   * Vloží dotaz do úložiště
   *
   * @param query Dotaz, který se má vložit
   */
  insert(query: Query): Promise<string>;

  /**
   * Odstraní dotaz z úložiště
   *
   * @param id ID dotazu, který se má odstranit
   */
  delete(id: string): Promise<void>;

  /**
   * Přihlásí se k odběru dotazů
   */
  observable(): Observable<QueryCollectionChange>;
}

export interface QueryCollectionChange {
  typeOfChange: TypeOfQueryChange;
  query: Query;
  // source: string;
}

export enum TypeOfQueryChange {
  ADD, REMOVE, CLEAR
}
