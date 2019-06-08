import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../../query/query';
import { DeleteHandler, FirebaseHandler } from '../handlers';

export class GroupInfo {
  checked: string;
}

@Component({
  selector: 'app-q-group',
  templateUrl: './q-group.component.html',
  styleUrls: ['./q-group.component.css']
})
export class QGroupComponent implements OnInit {

  @Input() values: string[];
  @Input() queries: Query[];
  @Input() filterFunction: Function;
  @Output() deleteRequest = new EventEmitter<DeleteHandler>();
  @Output() firebaseRequest = new EventEmitter<FirebaseHandler>();

  groupInformations = {};

  constructor() { }

  ngOnInit() {
    this.values.forEach(value => {
      this.groupInformations[value] = new GroupInfo();
    });
  }

  getQueries(value: string): Query[] {
    return this.queries.filter(query => this.filterFunction(query, value));
  }

  handleDeleteRequest(deleteHandler: DeleteHandler) {
    this.deleteRequest.emit(deleteHandler);
  }

  handleFirebaseRequest(firebaseHandler: FirebaseHandler) {
    this.firebaseRequest.emit(firebaseHandler);
  }

  handleCheckboxChange(event: Event) {
    const srcElement = (<HTMLInputElement> event.srcElement);
    const checked = srcElement.checked;
    const value = srcElement.value;

    this.getQueries(value).forEach(query => query.selected = checked);
    this.groupInformations[value].checked = checked;
  }
}
