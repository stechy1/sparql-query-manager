import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Query } from '../../query/query';
import { DeleteHandler, FirebaseHandler, FirebaseHandlerType } from '../handlers';
import { animation } from './q-entry.animation';

@Component({
  selector: 'app-q-entry',
  templateUrl: './q-entry.component.html',
  styleUrls: ['./q-entry.component.css'],
  animations: [
    animation
  ]
})
export class QEntryComponent implements OnInit {

  private _query: Query;
  private _visible: boolean;

  @Output() deleteRequest = new EventEmitter<DeleteHandler>();
  @Output() firebaseRequest = new EventEmitter<FirebaseHandler>();
  @Output() editRequest = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
    this._visible = false;
  }

  handleDelete(isRemote: boolean) {
    this.deleteRequest.emit({query: this._query, isRemote: isRemote});
  }

  handleUpload() {
    this.firebaseRequest.emit({query: this._query, handlerType: FirebaseHandlerType.UPLOAD});
  }

  handleDownload() {
    this.firebaseRequest.emit({query: this._query, handlerType: FirebaseHandlerType.DOWNLOAD});
  }

  handleEdit() {
    this.editRequest.emit(this._query.id);
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

  get formatedDateOfCreation() {
    const date = new Date(this._query.created);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }
}
