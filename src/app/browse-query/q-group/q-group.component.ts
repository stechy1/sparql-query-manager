import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../../query/query';

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
  @Output() deleteRequest = new EventEmitter<Query>();
  groupInformations = {};

  constructor() { }

  ngOnInit() {
    this.values.forEach(value => {
      this.groupInformations[value] = new GroupInfo();
    });
  }

  handleDeleteRequest(query: Query) {
    this.deleteRequest.emit(query);
  }

  getQueries(value: string): Query[] {
    return this.queries.filter(query => this.filterFunction(query, value));
  }

  handleCheckboxChange(event: Event) {
    const srcElement = (<HTMLInputElement> event.srcElement);
    const checked = srcElement.checked;
    const value = srcElement.value;

    this.getQueries(value).forEach(query => query.selected = checked);
    this.groupInformations[value].checked = checked;
  }
}
