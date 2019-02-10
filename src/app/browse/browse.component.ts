import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QueryService } from '../query/query.service';
import { Query } from '../query/query';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as Fuse from 'fuse.js';
import { FuseOptions } from 'fuse.js';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit, AfterViewInit {

  // Fusejs instance pro fulltextové vyhledávání
  private _fusejs: Fuse<Query, FuseOptions<Query>>;
  // Kolekce všech dotazů
  queries: Query[];
  // Pracovní kolekce dotazů získaná po fulltextovém vyhledávání, nad kterou se provádí filtrování a seskupování
  fuseQueries: Query[] = [];
  // Skupina ovládacích prvků pro výběr seskupování
  formGroupBy: FormGroup;
  // Skupina ovládacích prvků pro výběr typu řazení
  formOrderBy: FormGroup;
  // Skupina ovládacích prvků pro určení směru řazení
  formOrderType: FormGroup;
  // Hledaná hodnota pro fulltextové vyhledávání
  searchedValue: string;
  // Reference na input element
  @ViewChild('inputSearch') inputSearch: ElementRef;

  constructor(private _qservice: QueryService,
              private _route: ActivatedRoute, private _router: Router) { }

  /**
   * Obecná metoda pro import dotazů ze souboru
   *
   * @param input input element, ze kterého se přečte cesta k souboru
   * @param override true, pokud se má lokální databáze přepsat, false pro pouhé přidání nových dat
   */
  private _import(input: HTMLInputElement, override: boolean): Promise<Query[]> {
    const reader = new FileReader();
    const self = this;
    return new Promise<Query[]>((resolve) => {
      reader.onload = () => {
        const text = <string> reader.result;
        self._qservice.import(text, override);
        resolve(self._qservice.allQueries());
      };
      reader.readAsText(input.files[0]);
    });
  }

  /**
   * Metoda se zavolá vždy, když se změní způsob řazení dotazů
   *
   * @param orderBy Způsob, podle čeho se bude řadit
   * @param orderType Směr řazení (vzestupně/sestupně)
   */
  private _handleOrderBy(orderBy: string, orderType: string) {
    this.fuseQueries.sort((a, b) => a.name.localeCompare(b.name));
    switch (orderBy) {
      case 'last_run':
        this.fuseQueries.sort((a, b) => a.lastRun - b.lastRun);
        break;
      case 'date_of_creation':
        this.fuseQueries.sort((a, b) => a.created - b.created);
        break;
      case 'count_of_run':
        this.fuseQueries.sort((a, b) => a.runCount - b.runCount);
        break;
    }
    if (orderType === 'descending') {
      this.fuseQueries.reverse();
    }
  }

  ngOnInit() {
    // Uložení dotazů do lokální proměnné
    this.queries = this._qservice.allQueries();
    // Iniciaizace instance pro fulltextové vyhledávání
    this._fusejs = new Fuse(this.queries, {keys: ['name', 'tags']});
    // Vytvoření nové kolekce se všemi dotazy
    this.fuseQueries = [...this.queries];
    this.formGroupBy = new FormGroup({
      groupBy: new FormControl('none')
    });
    this.formOrderBy = new FormGroup({
      orderBy: new FormControl('alphabeticaly')
    });
    this.formOrderType = new FormGroup({
      orderType: new FormControl('ascending')
    });
    // Nastavení handleru na změnu parametrů ve stavovém řádku
    // díky tomu se provádí řazení a seskupování v reálném čase
    this._route.params.subscribe(params => {
      const groupBy = params['groupBy'] || 'none';
      const orderBy = params['orderBy'] || 'alphabeticaly';
      const orderType = params['orderType'] || 'ascending';
      this.formGroupBy.setValue({'groupBy': groupBy});
      this.formOrderBy.setValue({'orderBy': orderBy});
      this.formOrderType.setValue({'orderType': orderType});

      this._handleOrderBy(orderBy, orderType);
    });

    this.formGroupBy.valueChanges.subscribe(change => {
      const groupBy = change['groupBy'];
      const orderBy = this._route.snapshot.params['orderBy'] || 'alphabeticaly';
      const orderType = this._route.snapshot.params['orderType'] || 'ascending';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
    this.formOrderBy.valueChanges.subscribe(change => {
      const orderBy = change['orderBy'];
      const groupBy = this._route.snapshot.params['groupBy'] || 'none';
      const orderType = this._route.snapshot.params['orderType'] || 'ascending';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
    this.formOrderType.valueChanges.subscribe(change => {
      const orderType = change['orderType'];
      const orderBy = this._route.snapshot.params['orderBy'] || 'alphabeticaly';
      const groupBy = this._route.snapshot.params['groupBy'] || 'none';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
  }

  ngAfterViewInit(): void {
    // Nabindování změny hodnoty ve vyhledávacím řádku
    (<HTMLInputElement>this.inputSearch.nativeElement).onkeyup = ev => {
      // Získání nové hodnoty
      this.searchedValue = (<HTMLInputElement>ev.target).value;
      // Pokud je hodnota prázdná, nic nebudu vyhledávat a zobrazím všechny dotazy
      if (this.searchedValue === '') {
        this.fuseQueries.splice(0);
        for (const query of this.queries) {
          this.fuseQueries.push(query);
        }
        return;
      }

      // Hodnota není prázdná, jdu najít všechny odpovídající dotazy
      const fuseQueries = this._fusejs.search(this.searchedValue);
      // Vymažu všechny záznamy v pracovní kolekci
      this.fuseQueries.splice(0);
      // Přidám všechny nalezené záznamy do pracovní kolekce
      for (const query of fuseQueries) {
        this.fuseQueries.push(query);
      }
    };
  }

  /**
   * Metoda pro vyfiltrování dotazu podle endpointu
   *
   * @param query Dotaz
   * @param endpoint Požadovaný endpoint
   */
  filterByEndpoint(query: Query, endpoint: string): boolean {
    return query.endpoint === endpoint;
  }

  /**
   * Metoda pro vyfiltrování dotazu podle tagu
   *
   * @param query Dotaz
   * @param tag Požadovaný tag
   */
  filterByTag(query: Query, tag: string): boolean {
    return query.tags.indexOf(tag) !== -1;
  }

  handleDeleteRequest(query: Query) {
    this._qservice
    .delete(query.id)
    .then(() => {
      const index = this.fuseQueries.indexOf(query);
      this.fuseQueries.splice(index, 1);
    });
  }

  handleExport() {
    // Vytvořím neviditelný odkaz
    const a = document.createElement('a');
    // Vytvořím balík dat (obsah souboru = serializované vybrané dotazy)
    const file = new Blob([this._qservice.export(this.queries.filter(value => value.selected))], {type: 'text/plain'});
    // Nastavím odkaz na vytvořený balík dat
    a.href = URL.createObjectURL(file);
    // Požádám uživatele o název souboru, pod kterým se soubor uloží
    a.download = prompt('Zadejte název souboru...', 'queries.json');
    // Stáhnu soubor
    a.click();
  }

  handleImportOverride(event: Event) {
    this._import(<HTMLInputElement> event.target, true)
    .then(queries => {
      this.fuseQueries.splice(0);
      for (const query of queries) {
        this.fuseQueries.push(query);
      }
    });
  }

  handleImportAppend(event: Event) {
    this._import(<HTMLInputElement> event.target, false)
    .then(queries => {
      for (const query of queries) {
        this.fuseQueries.push(query);
      }
    });
  }

  handleSelectAll() {
    this.queries.forEach(query => query.selected = true);
  }

  handleSelectNone() {
    this.queries.forEach(query => query.selected = false);
  }

  handleDeleteAll() {
    if (confirm('Opravdu si přejete smazat celou databázi?')) {
      this._qservice.clear();
    }
  }

  get endpoints(): string[] {
    return this._qservice.endpoints;
  }

  get tags(): string[] {
    return this._qservice.tags;
  }

  get selectedQueries(): number {
    return this.queries.filter(value => value.selected).length;
  }
}
