import { Query } from './query';
import { Observable } from 'rxjs';

/**
 * Rozhraní obsahující společné metody pro přístup k úložišti
 * Každý poskytovatel dotazů musí implementovat toto rozhraní
 */
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

/**
 * Rozhraní reprezentující změnu v úložišti
 */
export interface QueryCollectionChange {
  // Typ změny
  typeOfChange: TypeOfQueryChange;
  // Dotaz, kterého se změna týká
  query: Query;
  // Název implementující třídy, která tuto změnu vyvolala
  source?: string;
}

/**
 * Rozhraní reprezentující typ změny v úložišti
 */
export enum TypeOfQueryChange {
  ADD, REMOVE, CLEAR
}
