import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Query } from '../query/query';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { QParamsComponent } from '../query/q-params/q-params.component';
import { NavigationService } from '../navigation/navigation.service';
import { EndpointCommunicatorService} from '../endpoint-communicator.service';
import { ToastrService } from 'ngx-toastr';
import { QueryResult } from '../query-result/query-result';
import { SettingsService } from '../settings/settings.service';
import { QueryService } from '../query/query.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  animations: [
    trigger('saveProgress', [
      state('notSaved', style({width: '0%', visibility: 'hidden'})),
      state('saved', style({width: '100%', visibility: 'visible'})),
      transition('notSaved => saved', animate('1s')),
      transition('saved => notSaved', animate('0s'))
    ])
  ]
})
export class EditComponent implements OnInit {

  private _query: Query;
  saveProgress: string;
  @ViewChild(QParamsComponent) paramsComponent: QParamsComponent;
  private _params: {};
  queryResult: QueryResult;

  constructor(private _qservice: QueryService, private _settings: SettingsService,
              private _navService: NavigationService, private _endpointCommunicator: EndpointCommunicatorService,
              private _toaster: ToastrService, private _route: ActivatedRoute,
              private _router: Router) { }

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this._qservice.byId(id)
    .then(value => this._query = value)
    .catch(() => {
      this._toaster.error('Nelze editovat přímo záznam z Firebase');
      this._router.navigate(['browse-query']);
    });
    this.saveProgress = 'notSaved';
    this._params = this._query.params;
    this._navService.setNavbar(null);
    this._navService.setSidebar(null);
  }

  get query(): Query {
    return this._query;
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
}
