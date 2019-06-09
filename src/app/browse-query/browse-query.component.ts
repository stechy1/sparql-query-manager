import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Query } from '../query/query';
import { QueryFilterGroupSortService } from './query-filter-group-sort.service';
import { DeleteHandler, FirebaseHandler, FirebaseHandlerType } from './handlers';
import { NavigationService } from '../navigation/navigation.service';
import { QueryService } from '../query/query.service';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-browse-query',
  templateUrl: './browse-query.component.html',
  styleUrls: ['./browse-query.component.css']
})
export class BrowseQueryComponent implements OnInit, AfterViewInit {

  // Reference na toolbar container
  @ViewChild('toolbarContainer', { static: true }) toolbar: ElementRef;
  // Reference na query container
  @ViewChild('queryContainer', { static: true }) queryList: ElementRef;
  // Kolekce všech dotazů
  private _queries: Query[];
  // Pomocný příznak, pomocí kterého zobrazuji dropdown s výběrem typu importu
  showImportDropdown: boolean;

  constructor(private _qservice: QueryService, private _navService: NavigationService,
              private _settings: SettingsService,
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
        self._qservice
        .prepareImport(text, override)
        .catch(reason => {
          console.log('Nelze snadno importovat dotazy. Je potřeba vyřešit duplicity...');
          return [];
        })
        .then(parsedQueryEntries => {
          self._qservice.import(parsedQueryEntries, override)
          .then(importedQueries => {
            self._toastr.success(`Importovaných dotazů: ${importedQueries}.`);
            self.showImportDropdown = false;
          });
        });
      };
      reader.readAsText(input.files[0]);
  }

  private _handleDownload(query: Query) {
    this._qservice.create(query).then(() => {
      this._toastr.success('Dotaz byl úspěšně stažen.');
    });
  }

  private _handleUpload(query: Query) {
    this._qservice.create(query).then(() => {
      this._toastr.success('Dotaz byl úspěšně nahrán.');
    });
  }

  ngOnInit() {
    // Načtení všech dotazů
    this._queries = this._qservice.allQueries();
    this.showImportDropdown = false;
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
      this._toastr.success('Dotaz byl smazán.');
    });
  }

  async handleExport() {
    // Požádám uživatele o název souboru, pod kterým se soubor uloží
    const fileName = prompt('Zadejte název souboru...', this._settings.defaultExportFileName);
    // Pokud uživatel klikne na tlačítko zrušit
    if (fileName == null) {
      // Nic se stahovat nebude
      return;
    }
    // Vytvořím neviditelný odkaz
    const a = document.createElement('a');
    // Nastavím název exportovaného souboru
    a.download = fileName;
    // Počkám si na vyexportování dotazů do řetězce
    const content = await this._qservice.export(this._qservice.allQueries().filter(value => value.selected));
    // Vytvořím balík dat (obsah souboru = serializované vybrané dotazy)
    const file = new Blob([content], {type: 'text/plain'});
    // Nastavím odkaz na vytvořený balík dat
    a.href = URL.createObjectURL(file);
    // Stáhnu soubor
    a.click();
    // Nakonec element odstraním z DOMu
    a.remove();
  }

  handleImportOverride(event: Event) {
    this._import(<HTMLInputElement> event.target, true);
  }

  handleImportAppend(event: Event) {
    this._import(<HTMLInputElement> event.target, false);
  }

  handleUpdatedImport() {
    console.log('Importuji správné záznamy');
  }

  handleSelectAll() {
    this._queries.forEach(query => query.selected = true);
  }

  handleSelectNone() {
    this._queries.forEach(query => query.selected = false);
  }

  handleDeleteAll() {
    if (confirm('Opravdu si přejete smazat celou databázi?')) {
      this._qservice.clear().then(() => {
        this._toastr.success('Dotazy byy smazány.');
      });
    }
  }

  handleNewQuery() {
    this._qservice.create().then(newId => {
      this._router.navigate(['edit', newId]);
    });
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
    return this._queries.filter(value => value.selected).length;
  }

  get queries(): Query[] {
    return this.qFilterGroupSortingService.fuseQueries;
  }

  get queryExists(): boolean {
    return this._qservice.allQueries().length !== 0;
  }
}
