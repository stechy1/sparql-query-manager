import { Injectable } from '@angular/core';
import { QueryService, TypeOfQueryChange } from '../query/query.service';
import { Query } from '../query/query';
import * as Fuse from 'fuse.js';
import { FuseOptions } from 'fuse.js';

@Injectable({
  providedIn: 'root'
})
export class QueryFilterGroupSortService {

  // Fusejs instance pro fulltextové vyhledávání
  private readonly _fusejs: Fuse<Query, FuseOptions<Query>>;
  // Způsob seskupování
  private _selectedGroup: string;
  // Pracovní kolekce dotazů získaná po fulltextovém vyhledávání, nad kterou se provádí filtrování a seskupování
  private readonly _fuseQueries: Query[];

  constructor(private _qservice: QueryService) {
    this._selectedGroup = 'none';
    // Uložení dotazů do lokální proměnné
    const queries = this._qservice.allQueries();
    // Iniciaizace instance pro fulltextové vyhledávání
    this._fusejs = new Fuse(queries, {keys: ['name', 'tags']});
    // Vytvoření nové kolekce se všemi dotazy
    this._fuseQueries = [...queries];
    // Registrace změn v původní koleci dotazů
    this._qservice.collectionChange.subscribe(value => {
      switch (value.typeOfChange) {
        case TypeOfQueryChange.ADD:
          this._fuseQueries.push(value.query);
          break;
        case TypeOfQueryChange.REMOVE:
          const index = this._fuseQueries.indexOf(value.query);
          this._fuseQueries.splice(index, 1);
          break;
        case TypeOfQueryChange.CLEAR:
          this._fuseQueries.splice(0);
          break;
      }
    });
  }

  /**
   * Metoda se zavolá vždy, když se změní způsob řazení dotazů
   *
   * @param orderBy Způsob, podle čeho se bude řadit
   * @param orderType Směr řazení (vzestupně/sestupně)
   */
  sort(orderBy: string, orderType: string) {
    this._fuseQueries.sort((a, b) => a.name.localeCompare(b.name));
    switch (orderBy) {
      case 'last_run':
        this._fuseQueries.sort((a, b) => a.lastRun - b.lastRun);
        break;
      case 'date_of_creation':
        this._fuseQueries.sort((a, b) => a.created - b.created);
        break;
      case 'count_of_run':
        this._fuseQueries.sort((a, b) => a.runCount - b.runCount);
        break;
    }
    if (orderType === 'descending') {
      this._fuseQueries.reverse();
    }
  }

  /**
   * Restartuje filtr vyhledávání
   */
  resetQueries() {
    this._fuseQueries.splice(0);
    for (const query of this._qservice.allQueries()) {
      this._fuseQueries.push(query);
    }
  }

  /**
   * Vyfiltruje dotazy podle parametru
   *
   * @param searchedValue Fulltextová hodnota
   */
  filterBy(searchedValue: string) {
    // Hodnota není prázdná, jdu najít všechny odpovídající dotazy
    const fuseQueries = this._fusejs.search(searchedValue);
    // Vymažu všechny záznamy v pracovní kolekci
    this._fuseQueries.splice(0);
    // Přidám všechny nalezené záznamy do pracovní kolekce
    for (const query of fuseQueries) {
      this._fuseQueries.push(query);
    }
  }

  get showActions(): boolean {
    return this._qservice.allQueries().length !== 0;
  }

  set selectedGroup(group: string) {
    this._selectedGroup = group;
  }

  get selectedGroup(): string {
    return this._selectedGroup;
  }

  get fuseQueries(): Query[] {
    return this._fuseQueries;
  }
}
