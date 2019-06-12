import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../query';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-q-name',
  templateUrl: './q-name.component.html',
  styleUrls: ['./q-name.component.css']
})
export class QNameComponent implements OnInit {

  @Input() query: Observable<Query>;
  @Output() dataChanged = new EventEmitter<Query>();

  private _query: Query;

  constructor() { }

  ngOnInit() {
    this.query.subscribe(value => {
      this._query = value;
    });
  }

  nameChanged(value: string) {
    if (this._query.name !== value) {
      this._query.name = value;
      this.dataChanged.emit(this._query);
    }
  }

  get name() {
    return (this._query) ? this._query.name : '';
  }
}
