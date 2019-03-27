import { Component, OnInit } from '@angular/core';
import { EndpointCommunicatorService } from '../endpoint-communicator.service';
import { copyToClipboard } from '../content-to-clipboard';
import { ActivatedRoute } from '@angular/router';
import { QueryResultService } from '../query-result/query-result.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-result-viewer',
  templateUrl: './result-viewer.component.html',
  styleUrls: ['./result-viewer.component.css']
})
export class ResultViewerComponent implements OnInit {

  queryResult: {};
  title: string;

  constructor(private _endpointCommunicator: EndpointCommunicatorService, private _qrservice: QueryResultService,
              private _route: ActivatedRoute, private _toaster: ToastrService) { }

  private _loadQuery(id: string) {
    if (id === 'last') {
      this.queryResult = this._endpointCommunicator.lastQueryResult;
      this.title = 'Výsledek posledního dotazu';
    } else {
      const result = this._qrservice.byId(id);
      this.queryResult = this._qrservice.byId(id).result;
      this.title = `Výsledek dotazu: ${result.name}`;
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
    this._toaster.success('Zpráva byla zkopírována');
  }
}
