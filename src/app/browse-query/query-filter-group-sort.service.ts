import { EventEmitter, Injectable } from '@angular/core';
import { Query } from '../query/query';
import * as Fuse from 'fuse.js';
import { FuseOptions, FuseResult } from 'fuse.js';
import { QueryService } from '../query/query.service';
import { TypeOfQueryChange } from '../query/query-storage-provider';
import { SettingsService } from '../settings/settings.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryFilterGroupSortService {

  private static readonly FUSEJS_SETTINGS = {
    tokenize: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name', 'tags']
  };

  // Fusejs instance pro fulltextové vyhledávání
  private readonly _fusejs: Fuse<Query, FuseOptions<Query>>;
  // Pracovní kolekce dotazů získaná po fulltextovém vyhledávání, nad kterou se provádí filtrování a seskupování
  private readonly _fuseQueries: Query[];
  // Způsob seskupování
  private _selectedGroup: string;
  private _orderBy$: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _qservice: QueryService) {
    this._selectedGroup = 'none';
    // Uložení dotazů do lokální proměnné
    const queries = this._qservice.allQueries();
    // Iniciaizace instance pro fulltextové vyhledávání
    this._fusejs = new Fuse(queries, QueryFilterGroupSortService.FUSEJS_SETTINGS);
    // Vytvoření nové kolekce se všemi dotazy
    this._fuseQueries = [...queries];
    // Registrace změn v původní koleci dotazů
    this._qservice.collectionChange.subscribe(value => {
      switch (value.typeOfChange) {
        case TypeOfQueryChange.ADD:
          this._fuseQueries.push(value.query);
          break;
        case TypeOfQueryChange.REMOVE:
          const index = this._fuseQueries.findIndex(query => query.id === value.query.id);
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
    console.log(orderBy);
    this._orderBy$.next(orderBy);
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
    // @ts-ignore
    const fuseResult = this._fusejs.search(searchedValue) as FuseResult<Query>[];
    console.log(fuseResult);
    // Vymažu všechny záznamy v pracovní kolekci
    this._fuseQueries.splice(0);
    // Přidám všechny nalezené záznamy do pracovní kolekce
    for (const result of fuseResult) {
      if (result.score < 0.4) {
        this._fuseQueries.push(result.item);
      }
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

  get sortedBy(): Observable<string> {
    return this._orderBy$;
  }
}

export class GroupByPosibilities {
  static readonly KEY = 'groupBy';

  static readonly NONE = new GroupByPosibilities('Neseskupovat', 'none');
  static readonly ENDPOINT = new GroupByPosibilities('Endpoint', 'endpoint');
  static readonly TAG = new GroupByPosibilities('Tag', 'tag');

  static readonly VALUES: GroupByPosibilities[] = [
    GroupByPosibilities.NONE,
    GroupByPosibilities.ENDPOINT,
    GroupByPosibilities.TAG
  ];

  private constructor(private _name: string, private _value: string) {}

  get name(): string {
    return this._name;
  }

  get value(): string {
    return this._value;
  }
}

export class OrderByPosibilities {
  static readonly KEY = 'orderBy';

  static readonly ALPHABET = new OrderByPosibilities('Abecedně', 'alphabeticaly');
  static readonly LAST_RUN = new OrderByPosibilities('Poslední spuštění', 'last_run');
  static readonly CREATION_DATE = new OrderByPosibilities('Datum vytvoření', 'date_of_creation');
  static readonly RUN_COUNT = new OrderByPosibilities('Počet spuštění', 'count_of_run');

  static readonly VALUES: OrderByPosibilities[] = [
    OrderByPosibilities.ALPHABET,
    OrderByPosibilities.LAST_RUN,
    OrderByPosibilities.CREATION_DATE,
    OrderByPosibilities.RUN_COUNT
  ];

  private constructor(private _name: string, private _value: string) {}

  get name(): string {
    return this._name;
  }

  get value(): string {
    return this._value;
  }

  static byValue(value: string): OrderByPosibilities {
    switch (value) {
      case 'alphabeticaly':
        return OrderByPosibilities.ALPHABET;
      case 'last_run':
        return OrderByPosibilities.LAST_RUN;
      case 'date_of_creation':
        return OrderByPosibilities.CREATION_DATE;
      case 'count_of_run':
        return OrderByPosibilities.RUN_COUNT;
    }
  }
}

export class OrderTypePosibilities {
  static readonly KEY = 'orderType';

  static readonly ASCENDING = new OrderTypePosibilities('Vzestupně', 'ascending');
  static readonly DESCENDING = new OrderTypePosibilities('Sestupně', 'descending');

  static readonly VALUES: OrderTypePosibilities[] = [
    OrderTypePosibilities.ASCENDING,
    OrderTypePosibilities.DESCENDING
  ];

  private constructor(private _name: string, private _value: string) {}

  get name(): string {
    return this._name;
  }

  get value(): string {
    return this._value;
  }
}
