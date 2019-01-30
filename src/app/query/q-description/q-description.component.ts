import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../query';

@Component({
  selector: 'app-q-description',
  templateUrl: './q-description.component.html',
  styleUrls: ['./q-description.component.css']
})
export class QDescriptionComponent implements OnInit {

  private _query: Query;
  @Output() dataChanged = new EventEmitter<Query>();

  constructor() { }

  ngOnInit() {
  }

  @Input()
  set query(value: Query) {
    this._query = value;
  }

  get description() {
    return this._query.description;
  }

  descriptionChanged(value: string) {
    if (this._query.description !== value) {
      this._query.description = value;
      this.dataChanged.emit(this._query);
    }
  }
}
