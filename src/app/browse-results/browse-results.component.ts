import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { QueryResult } from '../query-result/query-result';
import { QueryResultService } from '../query-result/query-result.service';

@Component({
  selector: 'app-browse-results',
  templateUrl: './browse-results.component.html',
  styleUrls: ['./browse-results.component.css']
})
export class BrowseResultsComponent {

  constructor(private _qresultService: QueryResultService) { }


  get queryResults(): QueryResult[] {
    return this._qresultService.allQueryResults();
  }

}
