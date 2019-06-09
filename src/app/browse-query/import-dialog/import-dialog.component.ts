import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { QueryStorageEntry } from '../../query/query-storage-entry';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css']
})
export class ImportDialogComponent implements OnInit {

  @Output() entries = new EventEmitter<QueryStorageEntry[]>();

  constructor() { }

  ngOnInit() {
  }

  doImport() {
    this.entries.emit([]);
    // this.entries.emit([{_id: 'id', _content: 'content', _created: 0, _description: 'descr', _endpoint: 'endpoint',
    // _lastRun: 0, _name: 'name', _params: [], _runCount: 0, _tags: []}]);
  }

}
