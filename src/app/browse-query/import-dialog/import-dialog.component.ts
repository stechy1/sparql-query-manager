import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { QueryAnalyzeResult } from '../../query/query.service';
import { ImportEntry } from '../../query/import-entry';
import { ImportStrategy } from '../../query/import-strategy';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css']
})
export class ImportDialogComponent implements OnInit {

  @Input() analyzedResult: Observable<QueryAnalyzeResult>;
  @Output() entries = new EventEmitter<ImportEntry[]>();

  private _uniqueEntries: ImportEntry[] = [];
  private _duplicatedEntries: ImportEntry[] = [];

  constructor() { }

  ngOnInit() {
    this.analyzedResult.subscribe(value => {
      this._uniqueEntries = value.normal.map(entry => new ImportEntry(entry, ImportStrategy.IMPORT_AS_NEW.value));
      this._duplicatedEntries = value.duplicated.map(entry => new ImportEntry(entry));
    });
  }

  doImport() {
    this.entries.emit(this._uniqueEntries.concat(this._duplicatedEntries));
  }

  get uniqueEntries(): ImportEntry[] {
    return this._uniqueEntries;
  }

  get duplicatedEntries(): ImportEntry[] {
    return this._duplicatedEntries;
  }

}
