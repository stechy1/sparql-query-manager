import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../query';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-q-endpoint',
  templateUrl: './q-endpoint.component.html',
  styleUrls: ['./q-endpoint.component.css']
})
export class QEndpointComponent implements OnInit {

  @Input() query: Observable<Query>;
  @Output() dataChanged = new EventEmitter<Query>();

  private _query: Query;

  constructor() { }

  ngOnInit() {
    this.query.subscribe(value => {
      this._query = value;
    });
  }

  endpointChanged(value: string) {
    if (this._query.endpoint !== value) {
      this._query.endpoint = value;
      this.dataChanged.emit(this._query);
    }
  }

  get endpoint() {
    return (this._query) ? this._query.endpoint : '';
  }
}
