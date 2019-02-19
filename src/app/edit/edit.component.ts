import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryService } from '../query/query.service';
import { ActivatedRoute } from '@angular/router';
import { Query } from '../query/query';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { QParamsComponent } from '../query/q-params/q-params.component';
import { NavigationService } from '../navigation/navigation.service';
import { EndpointCommunicatorService } from '../endpoint-communicator.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  animations: [
    trigger('saveProgress', [
      state('notSaved', style({width: '0%', visibility: 'hidden'})),
      state('saved', style({width: '100%', visibility: 'visible'})),
      transition('notSaved => saved', animate('3s')),
      transition('saved => notSaved', animate('0s'))
    ])
  ]
})
export class EditComponent implements OnInit {

  private _query: Query;
  saveProgress: string;
  working: boolean;
  @ViewChild(QParamsComponent) paramsComponent: QParamsComponent;
  private _params: {};
  queryResult: string;

  constructor(private _route: ActivatedRoute, private _qservice: QueryService,
              private _navService: NavigationService, private _endpointCommunicator: EndpointCommunicatorService) { }

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this._query = this._qservice.byId(id);
    this.saveProgress = 'notSaved';
    this.working = false;
    this._params = this._query.params;
    this._navService.setNavbar(null);
    this._navService.setSidebar(null);
  }

  get query(): Query {
    return this._query;
  }

  handleSaveQuery() {
    if (this.saveProgress === 'notSaved') {
      return;
    }

    this._params = this.paramsComponent.variablesWithoutUnused;
    this._query.params = this._params;
    this._qservice.performSave();
    this.saveProgress = 'notSaved';
  }

  handleQueryChange() {
    this.saveProgress = 'notSaved';
    const self = this;
    setTimeout(() => {self.saveProgress = 'saved'; }, 100);
  }

  handleManualQuerySave() {
    this.saveProgress = 'notSaved';
    this._params = this.paramsComponent.variablesWithoutUnused;
    this._query.params = this._params;
    this._qservice.performSave();
  }

  handleUpdateParams(event: string) {
    this._params = this.paramsComponent.findVariables(event, this._params);
  }

  handleDoQuery(ignoreStatistics: boolean) {
    this.working = true;
    if (!ignoreStatistics) {
      this._query.runCount++;
      this._query.lastRun = Date.now();
      this._qservice.performSave();
    }

    this._endpointCommunicator.makeRequest(this._query).then(value => {
      this.queryResult = value;
    }).finally(() => {
      this.working = false;
    });
  }
}
