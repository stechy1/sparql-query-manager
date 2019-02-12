import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryService } from '../query/query.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Query } from '../query/query';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { QParamsComponent } from '../query/q-params/q-params.component';
import { NavigationService } from '../navigation/navigation.service';

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
  @ViewChild(QParamsComponent) paramsComponent: QParamsComponent;
  private _params: {};

  constructor(private _route: ActivatedRoute, private _qservice: QueryService, private _navService: NavigationService) { }

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this._query = this._qservice.byId(id);
    this.saveProgress = 'notSaved';
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
}
