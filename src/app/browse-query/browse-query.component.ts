import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Query } from '../query/query';
import { QueryFilterGroupSortService } from './query-filter-group-sort.service';
import { DeleteHandler, FirebaseHandler, FirebaseHandlerType } from './handlers';
import { NavigationService } from '../navigation/navigation.service';
import { QueryAnalyzeResult, QueryService } from '../query/query.service';
import { SettingsService } from '../settings/settings.service';
import { ModalService } from '../share/modal/modal.service';
import { ModalComponent } from '../share/modal/modal.component';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-browse-query',
  templateUrl: './browse-query.component.html',
  styleUrls: ['./browse-query.component.css']
})
export class BrowseQueryComponent implements OnInit {

  private static readonly CONFIRM_DELETE_ALL = 'Opravdu si přejete smazat veškeré lokální dotazy?';
  private static readonly CONFIRM_DELETE = 'Opravdu si přejete smazat vybraný dotaz?';

  // Reference na toolbar container
  @ViewChild('toolbarContainer', { static: true }) toolbar: ElementRef;
  // Reference na query container
  @ViewChild('queryContainer', { static: true }) queryList: ElementRef;
  // Reference na kontejner s modálním dialogem
  @ViewChild('modalContainer', {static: true}) modalContainer: ModalComponent;
  // Kolekce všech dotazů
  private _queries: Query[];
  // Subjekt pro analyzovaný výsledek při importu dotazů
  private _analyzedResult = new Subject<QueryAnalyzeResult>();
  // Pomocný příznak, pomocí kterého zobrazuji dropdown s výběrem typu importu
  showImportDropdown: boolean;
  // Potvrzovací text, který se zobrazí v dialogu
  confirmText: string;

  constructor(private _qservice: QueryService, private _navService: NavigationService,
              private _settings: SettingsService,
              private _router: Router, private _toastr: ToastrService,
              private _modalService: ModalService,
              public qFilterGroupSortingService: QueryFilterGroupSortService) { }

  /**
   * Obecná metoda pro import dotazů ze souboru
   *
   * @param input input element, ze kterého se přečte cesta k souboru
   * @param override true, pokud se má lokální databáze přepsat, false pro pouhé přidání nových dat
   */
  private _import(input: HTMLInputElement, override: boolean) {
    // Vytvořím novou instanci třídy pro přečtení souboru
    const reader = new FileReader();
    const self = this;
    // Nastavím payload, který se zavolá po přečtení souboru
    reader.onload = () => {
      // Nejdříve schovám dropdown
      self.showImportDropdown = false;
      // Získám přečtený text
      const text = <string>reader.result;
      // Nad službou dotazů
      self._qservice
      // Zavolám přípravu importu
      .prepareImport(text, override)
      // Catch blok pro případ, že bude potřeba vyřešit duplicity
      .catch((analyzeResult: QueryAnalyzeResult) => {
        // Zaloguji, že budu muset řešit duplicity
        console.log('Nelze snadno importovat dotazy. Je potřeba vyřešit duplicity...');
        // Uložím si výsledek analýzy
        this._analyzedResult.next(analyzeResult);
        // Otevřu dialogové okno pro vyřešení duplicit
        return this._modalService.openForResult('modalContainer')
        // Pokud zruším operaci, nemůžu pokračovat v importu
        .catch(() => {
          throw new Error('Nemuzu pokracovat');
        });
      })
      // Zachytím neúspěšný proces předpřipravení dotazů
      .catch(() => {
        // Zobrazím notifikaci, pro informování uživatele
        self._toastr.error('Žádné dotazy se neimportovaly.');
        throw new Error();
      })
      // V případě, že předzpracování proběhlo úspěšně (žádné duplicity již neexistují
      .then(parsedQueryEntries => {
        // Spustím samotný importovací proces
        self._qservice.import(parsedQueryEntries, override)
        // Výsledek importu je počet importovaných dotazů
        .then(importedQueries => {
          // Uživateli zobrazím počet importovaných dotazů
          self._toastr.success(`Importovaných dotazů: ${importedQueries}.`);
        });
      })
      // Nakonec neudělám nic
      // Tento řádek tu musí být, abych odchytil případné zbývající errory
      .finally(() => {});
    };
    reader.readAsText(input.files[0]);
  }

  /**
   * Obecná metoda pro stažení dotazu
   *
   * @param query Dotaz, který se má stáhnout
   */
  private _handleDownload(query: Query) {
    this._qservice.create(query, true).then(() => {
      this._toastr.success('Dotaz byl úspěšně stažen.');
    });
  }

  /**
   * Obecná metoda pro nahrání dotazu
   *
   * @param query Dotaz, který se má nahrát
   */
  private _handleUpload(query: Query) {
    this._qservice.create(query, false).then(() => {
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

  /**
   * Reakce na tlačítko pro smazání dotazu
   *
   * @param deleteHandler Informace o smazání
   */
  handleDeleteRequest(deleteHandler: DeleteHandler) {
    this.confirmText = BrowseQueryComponent.CONFIRM_DELETE;
    this._modalService.openForResult('confirmContainer').then(() => {
      this._qservice.delete(deleteHandler.query.id, deleteHandler.isRemote)
      .then(() => {
        this._toastr.success('Dotaz byl smazán.');
      });
    })
    .finally(() => {});
  }

  /**
   * Reakce na tlačítko pro export vybraných dotazů
   */
  handleExport() {
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
    this._qservice.export(this._qservice.allQueries().filter(value => value.selected)).then((content) => {
        // Vytvořím balík dat (obsah souboru = serializované vybrané dotazy)
        const file = new Blob([content], {type: 'text/plain'});
        // Nastavím odkaz na vytvořený balík dat
        a.href = URL.createObjectURL(file);
        // Stáhnu soubor
        a.click();
        // Nakonec element odstraním z DOMu
        a.remove();
      });
  }

  /**
   * Reakce na tlačítko pro import dotazů
   * importované dotazy přepíší celou lokální databázi
   *
   * @param event Událost vyvolaná tlačítkem
   */
  handleImportOverride(event: Event) {
    this._import(<HTMLInputElement> event.target, true);
  }

  /**
   * Reakce na tlačítko pro import dotazů
   * importované dotazy se připojí k aktuální databázi
   *
   * @param event Událost vyvolaná tlačítkem
   */
  handleImportAppend(event: Event) {
    this._import(<HTMLInputElement> event.target, false);
  }

  /**
   * Reakce na tlačítko pro označení všech dotazů
   */
  handleSelectAll() {
    this._queries.forEach(query => query.selected = true);
  }

  /**
   * Reakce na tlačítko pro odoznačení všech dotazů
   */
  handleSelectNone() {
    this._queries.forEach(query => query.selected = false);
  }

  /**
   * Reakce na tlačítko pro smazání všech lokálních dotazů
   */
  handleDeleteAll() {
    // Nastavím potvrzovací text
    this.confirmText = BrowseQueryComponent.CONFIRM_DELETE_ALL;
    // Otevřu modální dialog, kde počkám na potvrzení od uživatele
    this._modalService.openForResult('confirmContainer').then(() => {
      // Uživatel potvrdil, že opravdu chce smazat všechny dotazy
      this._qservice.clear().then(() => {
        // Informuji uživatele, že jsem smažal všechny dotazy
        this._toastr.success('Dotazy byly smazány.');
      });
    });
  }

  /**
   * Reakce na tlačitko pro vytvoření nového dotazu
   */
  handleNewQuery() {
    // Nechám sluzbu vytvořit nový prázdný dotaz
    this._qservice.create().then(newId => {
      // Přesměruji uživatele do editoru tohoto dotazu
      this._router.navigate(['edit', newId]);
    });
  }

  /**
   * Handler pro práci s firebase
   *
   * @param $event Událost obsahující důležité parametry ke zpracování
   */
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

  /**
   * Reakce na tlačítko pro editaci dotazu
   *
   * @param id ID dotazu, který se má editovat
   */
  handleEdit(id: string) {
    this._router.navigate(['edit', id]);
  }

  /**
   * Reakce na tažení prstem doleva
   *
   * @param query Dotaz, nad kterým se táhlo prstem doleva
   */
  handleSwipeLeft(query: Query) {
    const deletePromises = [];
    if (query.downloaded) {
      deletePromises.push(this._qservice.delete(query.id));
    }
    if (query.uploaded) {
      deletePromises.push(this._qservice.delete(query.id, true));
    }
    Promise.all(deletePromises).then(() => {
      this._toastr.success('Dotaz byl smazán.');
    });
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

  get analyzedResult(): Observable<QueryAnalyzeResult> {
    return this._analyzedResult;
  }
}
