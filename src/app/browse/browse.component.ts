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
}
