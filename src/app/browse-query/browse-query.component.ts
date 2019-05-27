import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Query } from '../query/query';

import { NavigationService } from '../navigation/navigation.service';
import { QueryFilterGroupSortService } from './query-filter-group-sort.service';
import { Router } from '@angular/router';
import { DeleteHandler, FirebaseHandler, FirebaseHandlerType } from './handlers';
import { QueryService } from '../query/query.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-browse-query',
  templateUrl: './browse-query.component.html',
  styleUrls: ['./browse-query.component.css']
})
export class BrowseQueryComponent implements OnInit, AfterViewInit {

  // Kolekce všech dotazů
  queries: Query[];
  // Reference na toolbar container
  @ViewChild('toolbarContainer') toolbar: ElementRef;
  // Reference na query container
  @ViewChild('queryContainer') queryList: ElementRef;
  // Pomocný příznak, pomocí kterého zobrazuji dropdown s výběrem typu importu
  showImportDropdown: boolean;
  // Poslední yOffset toolbaru
  private _lastYOffset: number;

  constructor(private _qservice: QueryService, private _navService: NavigationService,
              private _router: Router, private _toastr: ToastrService,
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
        self._qservice.import(text, override).then(importedQueries => {
          self._toastr.success(`Importovaných dotazů: ${importedQueries}.`);
        });
      };
      reader.readAsText(input.files[0]);
  }

  /**
   * Nastaví horní margin seznamu dotazů
   */
  private _recalculateQueryListMargin() {
    const queryDiv = (<HTMLDivElement> this.queryList.nativeElement);
    if (window.innerWidth <= 992) {
      queryDiv.style.marginTop = `0px`;
      return;
    }

    const toolbarDiv = (<HTMLDivElement> this.toolbar.nativeElement);
    const divHeight = toolbarDiv.clientHeight;
    toolbarDiv.classList.add('sticky');
    toolbarDiv.classList.remove('hide');
    queryDiv.style.marginTop = `${divHeight}px`;
  }

  private _handleDownload(query: Query) {
    this._qservice.create(query);
  }

  private _handleUpload(query: Query) {
    this._qservice.create(query);
  }

  ngOnInit() {
    // Uložení dotazů do lokální proměnné
    this.queries = this._qservice.allQueries();
    this.showImportDropdown = false;
    this._lastYOffset = window.pageYOffset;
  }

  ngAfterViewInit(): void {
    this._recalculateQueryListMargin();
  }

  @HostListener('window:scroll')
  scrollHandler() {
    const queryDiv = (<HTMLDivElement> this.queryList.nativeElement);
    if (window.innerWidth <= 992) {
      queryDiv.style.marginTop = `0px`;
      return;
    }
    const newOffset = window.pageYOffset;
    const delta = newOffset - this._lastYOffset;
    const toolbarDiv = (<HTMLDivElement> this.toolbar.nativeElement);
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

  handleDeleteRequest(deleteHandler: DeleteHandler) {
    this._qservice.delete(deleteHandler.query.id, deleteHandler.isRemote)
    .then(() => {
      setTimeout(() => this._recalculateQueryListMargin(), 100);
    });
  }

  async handleExport() {
    // Vytvořím neviditelný odkaz
    const a = document.createElement('a');
    // Počkám si na vyexportování dotazů do řetězce
    const content = await this._qservice.export(this._qservice.allQueries().filter(value => value.selected));
    // Vytvořím balík dat (obsah souboru = serializované vybrané dotazy)
    const file = new Blob([content], {type: 'text/plain'});
    // Nastavím odkaz na vytvořený balík dat
    a.href = URL.createObjectURL(file);
    // Požádám uživatele o název souboru, pod kterým se soubor uloží
    a.download = prompt('Zadejte název souboru...', 'queries$.json');
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

  handleFirebaseRequest($event: FirebaseHandler) {
    switch ($event.handlerType) {
      case FirebaseHandlerType.DOWNLOAD:
        this._handleDownload($event.query);
        break;
      case FirebaseHandlerType.UPLOAD:
        this._handleUpload($event.query);
        break;
      default:
        console.log('Neznámá akce.');
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
