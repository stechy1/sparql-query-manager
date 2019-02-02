import { Component, OnInit } from '@angular/core';
import { QueryService } from '../query/query.service';
import { Query } from '../query/query';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

  private _queries: Query[];

  constructor(private _qservice: QueryService) { }

  ngOnInit() {
    this._queries = this._qservice.allQueries();
  }

  get queries() {
    return this._queries;
  }

  handleDeleteRequest(id: string) {
    this._qservice.delete(id);
  }

  handleImportOverride() {
    // TODO implementovat import dat s přepsáním lokální databáze
  }

  handleImportAppend() {
    // TODO implementovat import dat metodou mergování
  }

  handleSelectAll() {
    // TODO implementovat výběr všech dotazů
  }

  handleSelectNone() {
    // TODO implementovat zrušení výběru všech dotazů
  }
}
