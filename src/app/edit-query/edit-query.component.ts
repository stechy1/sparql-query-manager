import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Query } from '../query/query';
import { QParamsComponent } from '../query/q-params/q-params.component';
import { NavigationService } from '../navigation/navigation.service';
import { EndpointCommunicatorService} from '../share/endpoint-communicator.service';
import { ToastrService } from 'ngx-toastr';
import { QueryResult } from '../query-result/query-result';
import { SettingsService } from '../settings/settings.service';
import { QueryService } from '../query/query.service';
import { Observable, Subject } from 'rxjs';
import { ModalService } from '../share/modal/modal.service';

@Component({
  selector: 'app-edit-query',
  templateUrl: './edit-query.component.html',
  styleUrls: ['./edit-query.component.css'],
  animations: [
    trigger('saveProgress', [
      state('notSaved', style({width: '0%', visibility: 'hidden'})),
      state('saved', style({width: '100%', visibility: 'visible'})),
      transition('notSaved => saved', animate('1s')),
      transition('saved => notSaved', animate('0s'))
    ])
  ]
})
export class EditQueryComponent implements OnInit {

  // Reference na komponentu spravující parametry dotazu
  @ViewChild(QParamsComponent, { static: true }) paramsComponent: QParamsComponent;

  // Aktuální stav save progresu
  saveProgress: string;
  // Reference na výsledek dotazu
  queryResult: QueryResult;

  // Subject, který se aktualizuje, když se načte dotaz
  private _querySubject = new Subject<Query>();
  // Subjekt, který se aktualizuje, když se získají parametry z dotazu
  private _paramsSubject = new Subject<{}>();

  constructor(private _qservice: QueryService, private _settings: SettingsService,
              private _navService: NavigationService, private _endpointCommunicator: EndpointCommunicatorService,
              private _modalService: ModalService,
              private _toaster: ToastrService, private _route: ActivatedRoute,
              private _router: Router) { }

  // Reference na aktuální dotaz
  private _query: Query;
  // Reference na aktuální parametry
  private _params: {};

  ngOnInit() {
    // Získám ID dotazu, který chci editovat
    const id = this._route.snapshot.paramMap.get('id');
    // Vyžádám si dotaz ze služby dotazů
    this._qservice.byId(id)
    // V případě, že dotaz existuje
    .then(value => {
      // Uložím si jeho záznam
      this._query = value;
      // Uložím si parametry dotazu
      this._params = value.params;
      // Aktualizuji subjekt dotazu (tím se aktualizují všechny subcomponenty
      this._querySubject.next(value);
      // AKtualizuji subjekt parametrů dotazu
      this._paramsSubject.next(this._query.params);
    })
    .catch((result) => {
      // V případě, že dotaz nebyl nalezen
      if (result === undefined) {
        // Zobrazím notifikací uživateli
        this._toaster.error('Dotaz nebyl nalezen!');
        // Přesměruji uživatele zpátky na prohlížeč dotazů
        this._router.navigate(['browse-query']);
      } else {
        // Dotaz byl sice nalezen, ale je uložen pouze v cloudu
        this._query = result;
        // Zobrazím potvrzovací dialog s otázkou, zda-li chce uživatel
        // stáhnout dotaz, aby ho mohl editovat
        this._modalService.open('confirmContainer');
      }
    });
    // Nastavím ukládací stav na neuloženo
    this.saveProgress = 'notSaved';
    // V navigační službě vymažu navbar a sidebar
    this._navService.setNavbar(null);
    this._navService.setSidebar(null);
  }

  /**
   * Reakce na tlačítko pro uložení dotazu
   */
  handleSaveQuery() {
    if (this.saveProgress === 'notSaved') {
      return;
    }

    this._params = this.paramsComponent.variablesWithoutUnused;
    this._query.params = this._params;
    this._qservice.performSave();
    this.saveProgress = 'notSaved';
    this._toaster.success('Dotaz byl uložen');
  }

  /**
   * Reakce na tlačítko pro uložení změn hodnot v dotazu
   */
  handleQueryChange() {
    const self = this;
    this.saveProgress = 'notSaved';
    if (this._settings.useSaveDelay) {
      setTimeout(() => {
        self.saveProgress = 'saved';
      }, this._settings.saveDelay);
    } else {
      this.handleManualQuerySave();
    }
  }

  /**
   * Reakce na tlačítko pro manuální uložení změn hodnot v dotazu
   */
  handleManualQuerySave() {
    this.saveProgress = 'notSaved';
    this._params = this.paramsComponent.variablesWithoutUnused;
    this._query.params = this._params;
    this._qservice.performSave();
    this._toaster.success('Dotaz byl uložen');
  }

  /**
   * Reakce na tlačítko pro aktualizaci parametrů dotazu
   *
   * @param event Samotný text dotazu
   */
  handleUpdateParams(event: string) {
    this._params = this.paramsComponent.findVariables(event, this._params);
    this._paramsSubject.next(this._params);
  }

  /**
   * Reakce na tlačítko pro vykonání samotného dotazu
   *
   * @param ignoreStatistics True, pokud se výsledek dotazu nemá započítávat do statistik, jinak False
   */
  handleDoQuery(ignoreStatistics: boolean) {
    if (!ignoreStatistics) {
      this._query.runCount++;
      this._query.lastRun = Date.now();
      this._qservice.performSave();
    }

    this._endpointCommunicator.makeRequest(this._query, ignoreStatistics)
      .then(value => {
        this.queryResult = value;
      });
  }

  /**
   * Reakce na tlačítko pro potvrzení stažení dotazu z cloudu pro editaci dotazu
   */
  handleConfirmDownloadForEdit() {
    this._qservice.create(this._query, true).then(newID => {
      this._router.navigate(['browse-query']).then(() => {
        this._router.navigate(['edit', newID]);
      });
    });
  }

  /**
   * Reakce na tlačítko pro nepřijmutí stažení dotazu z cloudu
   */
  handleCancelDownloadForEdit() {
    this._router.navigate(['browse-query']);
  }

  get query(): Observable<Query> {
    return this._querySubject;
  }

  get params(): Observable<{}> {
    return this._paramsSubject;
  }
}
