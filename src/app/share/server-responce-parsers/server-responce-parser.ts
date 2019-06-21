export interface ServerResponceParser {

  /**
   * Počet řádek
   */
  countOfSelect(): number;

  /**
   * Počet trojic
   */
  countOfConstruct(): number;

}
