import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../query';
import { ResponceFormat } from '../../endpoint-communicator.service';

@Component({
  selector: 'app-q-actions',
  templateUrl: './q-actions.component.html',
  styleUrls: ['./q-actions.component.css']
})
export class QActionsComponent implements OnInit {

  @Input() query: Query;
  @Input() working: boolean;
  @Output() doQuery = new EventEmitter();

  ignoreStatistics: boolean;
  responceFormats = Object.keys(ResponceFormat);
  selectedResponceFormat: string;

  constructor() { }

  ngOnInit() {
    this.working = false;
    this.ignoreStatistics = false;
  }

  handleDoQuery() {
    this.doQuery.emit(this.ignoreStatistics);
  }
}
