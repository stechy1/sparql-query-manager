import { Component, OnInit } from '@angular/core';
import { EndpointCommunicatorService } from '../endpoint-communicator.service';
import { copyToClipboard } from '../content-to-clipboard';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryResultService } from '../query-result/query-result.service';
import { ToastrService } from 'ngx-toastr';
import { QueryResult } from '../query-result/query-result';

@Component({
  selector: 'app-result-viewer',
  templateUrl: './result-viewer.component.html',
  styleUrls: ['./result-viewer.component.css']
})
export class ResultViewerComponent implements OnInit {

  queryResult: QueryResult;
  title: string;
  showResult: boolean;

  constructor(private _endpointCommunicator: EndpointCommunicatorService, private _qrservice: QueryResultService,
              private _route: ActivatedRoute, private _router: Router,
              private _toaster: ToastrService) { }

  /**
   * Načte výsledek dotazu podle ID
   *
   * @param id ID dotazu
   */
  private _loadQueryResult(id: string) {
    if (id === 'last') {
      this.queryResult = <QueryResult>this._endpointCommunicator.lastQueryResult;
      this.title = 'Výsledek posledního dotazu';
      if (this.queryResult === undefined) {
        this._router.navigate(['browse-results']);
      }
    } else {
      this.queryResult = this._qrservice.byId(id);
      this.title = `Výsledek dotazu: ${this.queryResult.name}`;
    }
  }

  ngOnInit() {
    const resultId = this._route.snapshot.params['id'];
    this._loadQueryResult(resultId);
    this._route.params.subscribe(value => {
      this._loadQueryResult(value['id']);
    });
    this.showResult = this._route.snapshot.queryParams['tab'] === 'result';
  }

  handleCopyResult() {
    copyToClipboard(this.queryResult);
    this._toaster.success('Zpráva byla zkopírována');
  }
}
