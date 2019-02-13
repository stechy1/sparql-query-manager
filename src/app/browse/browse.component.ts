import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { QueryService } from '../query/query.service';
import { Query } from '../query/query';

import { NavigationService } from '../navigation/navigation.service';
import { BrowseToolbarComponent } from './browse-toolbar/browse-toolbar.component';
import { QueryFilterGroupSortService } from './query-filter-group-sort.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit, AfterViewInit {

  private _lastYOffset: number;
  // Kolekce všech dotazů
  queries: Query[];
  // Reference na input element
  @ViewChild('inputSearch') inputSearch: ElementRef;
  @ViewChild('toolbarContainer') toolbar: ElementRef;
  @ViewChild('queryContainer') queryList: ElementRef;
  showImportDropdown: boolean;

  constructor(private _qservice: QueryService, private _navService: NavigationService,
              private _router: Router,
              public qFilterGroupSortingService: QueryFilterGroupSortService) { }

  /**
   * Obecná metoda pro import dotazů ze souboru
   *
   * @param input input element, ze kterého se přečte cesta k souboru
   * @param override true, pokud se má lokální databáze přepsat, false pro pouhé přidání nových dat
   */
  private _import(input: HTMLInputElement, override: boolean) {
    const reader = new FileReader();
    const self = this;
      reader.onload = () => {
        const text = <string> reader.result;
        self._qservice.import(text, override);
      };
      reader.readAsText(input.files[0]);
  }

  /**
   * Nastaví horní margin seznamu dotazů
   */
  private _recalculateQueryListMargin() {
    const toolbarDiv = (<HTMLDivElement> this.toolbar.nativeElement);
    const queryDiv = (<HTMLDivElement> this.queryList.nativeElement);
    const divHeight = toolbarDiv.clientHeight;
    toolbarDiv.classList.add('sticky');
    toolbarDiv.classList.remove('hide');
    queryDiv.style.marginTop = `${divHeight}px`;
  }

  ngOnInit() {
    // Uložení dotazů do lokální proměnné
    this.queries = this._qservice.allQueries();
    this._navService.setSidebar(BrowseToolbarComponent);
    this.showImportDropdown = false;
    this._lastYOffset = window.pageYOffset;
  }

  ngAfterViewInit(): void {
    // Nabindování změny hodnoty ve vyhledávacím řádku
    (<HTMLInputElement>this.inputSearch.nativeElement).onkeyup = ev => {
      // Získání nové hodnoty
      const searchedValue = (<HTMLInputElement>ev.target).value;
      // Pokud je hodnota prázdná, nic nebudu vyhledávat a zobrazím všechny dotazy
      if (searchedValue === '') {
        this.qFilterGroupSortingService.resetQueries();
        return;
      }

      this.qFilterGroupSortingService.filterBy(searchedValue);
    };

    this._recalculateQueryListMargin();
  }

  @HostListener('window:scroll')
  scrollHandler() {
    const newOffset = window.pageYOffset;
    const delta = newOffset - this._lastYOffset;
    const toolbarDiv = (<HTMLDivElement> this.toolbar.nativeElement);
    const queryDiv = (<HTMLDivElement> this.queryList.nativeElement);
    const toolbarDivHeight = toolbarDiv.clientHeight;
    const queryDivHeight = queryDiv.clientHeight;
    const windowHeight = window.innerHeight;
    this._lastYOffset = newOffset;
    if (delta < 0) {
      toolbarDiv.classList.add('sticky');
      toolbarDiv.classList.remove('hide');
      queryDiv.style.marginTop = `${toolbarDivHeight}px`;
    } else {
      if (queryDivHeight > windowHeight) {
        toolbarDiv.classList.remove('sticky');
        toolbarDiv.classList.add('hide');
        queryDiv.style.marginTop = `0px`;
      }
    }
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
    this._qservice.delete(query.id);
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
    this._import(<HTMLInputElement> event.target, true);
    setTimeout(() => this._recalculateQueryListMargin(), 100);
  }

  handleImportAppend(event: Event) {
    this._import(<HTMLInputElement> event.target, false);
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
      setTimeout(() => this._recalculateQueryListMargin(), 100);
    }
  }

  handleNewQuery() {
    const newId = this._qservice.create();
    this._router.navigate(['edit', newId]);
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
