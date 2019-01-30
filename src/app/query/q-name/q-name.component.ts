import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../query';

@Component({
  selector: 'app-q-name',
  templateUrl: './q-name.component.html',
  styleUrls: ['./q-name.component.css']
})
export class QNameComponent implements OnInit {

  private _query: Query;
  @Output() dataChanged = new EventEmitter<Query>();

  constructor() { }

  ngOnInit() {
  }

  @Input()
  set query(value: Query) {
    this._query = value;
  }

  get name() {
    return this._query.name;
  }

  nameChanged(value: string) {
    if (this._query.name !== value) {
      this._query.name = value;
      this.dataChanged.emit(this._query);
    }
  }
}
