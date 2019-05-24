import { Query } from './query';

export interface IQueryCRUD {

  /**
   * Vrátí kolekci všech dotazů
   */
  allQueries(): Query[];

  /**
   * Najde dotaz podle ID
   *
   * @param id ID dotazu, který se má vrátit
   */
  byId(id: string): Query;

  /**
   * Vytvoří nový prázdný dotaz
   */
  create(): void;

  /**
   * Odstraní záznam podle ID
   *
   * @param id ID záznamu, který se má odstranit
   */
  delete(id: string): void;

  /**
   * Vynucení uložení dotazů na disk
   */
  performSave();

  /**
   * Serializuje vybrané dotazy do textové podoby
   *
   * @param queries Pole všech dotazů, které se budou exportovat
   */
  export(queries: Query[]): string;

  /**
   * Importuje dotazy
   *
   * @param text Serializované dotazy
   * @param override True, pokud importované dotazy mají přepsat lokální databázi, jinak false
   */
  import(text: string, override: boolean);

  /**
   * Vymaže celou lokální databázi
   */
  clear(): void;

  /**
   * Vytvoří hlubokou kopii zadaného dotazu a uloží ho do paměti
   *
   * @param query Dotaz {@link Query}, který se má zduplikovat
   * @return ID nového dotazu
   */
  duplicate(query: Query): string;

  /**
   * Vygeneruje pole všech endpointů, které jsou v dotazech
   */
  endpoints(): string[];

  /**
   * Vygeneruje pole všech tagů, které jsou v dotazech
   */
  tags(): string[];
}
