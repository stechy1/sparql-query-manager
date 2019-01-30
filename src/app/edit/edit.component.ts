import { Component, OnInit } from '@angular/core';
import { QueryService } from '../query/query.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Query } from '../query/query';
import { animate, state, style, transition, trigger } from '@angular/animations';

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

  constructor(private _route: ActivatedRoute, private _qservice: QueryService, private _location: Location) { }

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this._query = this._qservice.byId(id);
    this.saveProgress = 'notSaved';
  }

  get query(): Query {
    return this._query;
  }

  toggleProgress() {
    this.saveProgress = this.saveProgress === 'notSaved' ? 'saved' : 'notSaved';
  }

  handleSaveQuery() {
    if (this.saveProgress === 'notSaved') {
      return;
    }

    console.log('Ukládám dotaz...');
    this.saveProgress = 'notSaved';
  }
}
