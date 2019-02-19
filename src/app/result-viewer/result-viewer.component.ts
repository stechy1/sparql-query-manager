import { Component, OnInit } from '@angular/core';
import { EndpointCommunicatorService } from '../endpoint-communicator.service';
import { copyToClipboard } from '../content-to-clipboard';
import { ActivatedRoute } from '@angular/router';
import { QueryResultService } from '../query-result/query-result.service';

@Component({
  selector: 'app-result-viewer',
  templateUrl: './result-viewer.component.html',
  styleUrls: ['./result-viewer.component.css']
})
export class ResultViewerComponent implements OnInit {

  queryResult: string;

  constructor(private _endpointCommunicator: EndpointCommunicatorService, private _qrservice: QueryResultService,
              private _route: ActivatedRoute) { }

  private _loadQuery(id: string) {
    if (id === 'last') {
      this.queryResult = this._endpointCommunicator.lastQueryResult;
    } else {
      this.queryResult = this._qrservice.byId(id).result;
    }
  }

  ngOnInit() {
    const resultId = this._route.snapshot.params['id'];
    this._loadQuery(resultId);
    this._route.params.subscribe(value => {
      this._loadQuery(value['id']);
    });
  }

  handleCopyResult() {
    copyToClipboard(this.queryResult);
  }
}
