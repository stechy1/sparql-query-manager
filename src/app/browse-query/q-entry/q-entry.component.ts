import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Query } from '../../query/query';
import { DeleteHandler, FirebaseHandler, FirebaseHandlerType } from '../handlers';
import { animation, swipeLeft } from './q-entry.animation';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-q-entry',
  templateUrl: './q-entry.component.html',
  styleUrls: ['./q-entry.component.css'],
  animations: [
    animation,
    swipeLeft
  ]
})
export class QEntryComponent implements OnInit, AfterViewInit {

  @Output() deleteRequest = new EventEmitter<DeleteHandler>();
  @Output() firebaseRequest = new EventEmitter<FirebaseHandler>();
  @Output() editRequest = new EventEmitter<string>();
  @Output() swipeLeftRequest = new EventEmitter<Query>();

  querySwipe: string;

  private _query: Query;
  private _visible: boolean;
  private _enableGestures: boolean;

  constructor(private _settings: SettingsService) {
    this._enableGestures = false;
  }

  ngOnInit() {
    this._visible = false;
  }

  ngAfterViewInit(): void {
    if (this._settings.useGestures) {
      setTimeout(() => {
        this._enableGestures = true;
      }, 1000);
    }
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

  handleSwipeLeft() {
    if (!this._enableGestures) {
      return;
    }
    this.querySwipe = 'slideOutLeft';
  }

  handleSwipeLeftDone() {
    if (!this._enableGestures) {
      return;
    }
    this.swipeLeftRequest.emit(this._query);
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
