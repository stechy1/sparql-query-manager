import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../query';

@Component({
  selector: 'app-q-endpoint',
  templateUrl: './q-endpoint.component.html',
  styleUrls: ['./q-endpoint.component.css']
})
export class QEndpointComponent implements OnInit {

  @Output() dataChanged = new EventEmitter<Query>();

  private _query: Query;

  constructor() { }

  ngOnInit() {}

  endpointChanged(value: string) {
    if (this._query.endpoint !== value) {
      this._query.endpoint = value;
      this.dataChanged.emit(this._query);
    }
  }

  @Input()
  set query(value: Query) {
    this._query = value;
  }

  get endpoint() {
    return this._query.endpoint;
  }
}
