import { Component, Input, OnInit } from '@angular/core';
import { Query } from '../../query/query';

@Component({
  selector: 'app-q-entry',
  templateUrl: './q-entry.component.html',
  styleUrls: ['./q-entry.component.css'],
})
export class QEntryComponent implements OnInit {

  private _query: Query;
  private _visible: boolean;

  constructor() {
  }

  ngOnInit() {
    this._visible = false;
  }

  @Input()
  set query(value: Query) {
    this._query = value;
  }

  get query(): Query {
    return this._query;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  get visible(): boolean {
    return this._visible;
  }

}
