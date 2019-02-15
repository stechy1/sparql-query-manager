import { Component, OnInit } from '@angular/core';
import { QueryResult } from '../query-result/query-result';
import { QueryResultService } from '../query-result/query-result.service';

@Component({
  selector: 'app-browse-results',
  templateUrl: './browse-results.component.html',
  styleUrls: ['./browse-results.component.css']
})
export class BrowseResultsComponent implements OnInit {

  queryResults: QueryResult[];

  constructor(private _qresultService: QueryResultService) { }

  ngOnInit() {
    this.queryResults = this._qresultService.allQueryResults();
  }

}
