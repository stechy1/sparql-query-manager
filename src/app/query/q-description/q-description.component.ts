import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../query';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-q-description',
  templateUrl: './q-description.component.html',
  styleUrls: ['./q-description.component.css']
})
export class QDescriptionComponent implements OnInit {

  @Input() query: Observable<Query>;
  @Output() dataChanged = new EventEmitter<Query>();

  private _query: Query;

  constructor() { }

  ngOnInit() {
    this.query.subscribe(value => {
      this._query = value;
    });
  }

  descriptionChanged(value: string) {
    if (this._query.description !== value) {
      this._query.description = value;
      this.dataChanged.emit(this._query);
    }
  }

  get description() {
    return (this._query) ? this._query.description : '';
  }
}
