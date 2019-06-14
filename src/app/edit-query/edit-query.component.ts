import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Query } from '../query/query';
import { QParamsComponent } from '../query/q-params/q-params.component';
import { NavigationService } from '../navigation/navigation.service';
import { EndpointCommunicatorService} from '../endpoint-communicator.service';
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

  @ViewChild(QParamsComponent, { static: true }) paramsComponent: QParamsComponent;

  saveProgress: string;
  queryResult: QueryResult;

  private _querySubject = new Subject<Query>();
  private _paramsSubject = new Subject<{}>();

  constructor(private _qservice: QueryService, private _settings: SettingsService,
              private _navService: NavigationService, private _endpointCommunicator: EndpointCommunicatorService,
              private _modalService: ModalService,
              private _toaster: ToastrService, private _route: ActivatedRoute,
              private _router: Router) { }

  private _query: Query;
  private _params: {};

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this._qservice.byId(id)
    .then(value => {
      this._query = value;
      this._params = value.params;
      this._querySubject.next(value);
      this._paramsSubject.next(this._query.params);
    })
    .catch((result) => {
      if (result === undefined) {
        this._toaster.error('Dotaz nebyl nalezen!');
        this._router.navigate(['browse-query']);
      } else {
        this._query = result;
        this._modalService.open('confirmContainer');
      }
    });
    this.saveProgress = 'notSaved';
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

    this._endpointCommunicator.makeRequest(this._query, ignoreStatistics).then(value => {
      this.queryResult = value;
    });
  }

  handleConfirmDownloadForEdit() {
    this._qservice.create(this._query, true).then(newID => {
      this._router.navigate(['browse-query']).then(() => {
        this._router.navigate(['edit', newID]);
      });
    });
  }

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
