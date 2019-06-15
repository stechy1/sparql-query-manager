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

  // Pole unikátních záznamů dotazů
  private _uniqueEntries: ImportEntry[] = [];
  // Pole duplicitních záznamů dotazů
  private _duplicatedEntries: ImportEntry[] = [];

  constructor() { }

  ngOnInit() {
    // Přihlásím se k odběru analyzovaného výsledku dotazů
    this.analyzedResult.subscribe(value => {
      // Namapuji unikátní záznamy dotazů na třídu ImportEntry
      // druhý parametr v konstruktoru říká, že dotaz se bude standartně vkládat
      this._uniqueEntries = value.normal.map(entry => new ImportEntry(entry, ImportStrategy.IMPORT_AS_NEW.value));
      // Namapuji duplicitní záznamy dotazů na třídu ImportEntry
      // v tomto případě se předpokládá, že duplicitní záznam nahradí existující
      this._duplicatedEntries = value.duplicated.map(entry => new ImportEntry(entry));
    });
  }

  /**
   * Vytvoří pole z unikátních a duplikovaných záznamů dotazů a
   * toto pole vyšle jako výsledek dialogu
   */
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
