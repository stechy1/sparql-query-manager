import { Component, OnInit } from '@angular/core';
import { EndpointCommunicatorService } from '../endpoint-communicator.service';
import { copyToClipboard } from '../content-to-clipboard';

@Component({
  selector: 'app-last-result',
  templateUrl: './last-result.component.html',
  styleUrls: ['./last-result.component.css']
})
export class LastResultComponent implements OnInit {

  queryResult: string;

  constructor(private _endpointCommunicator: EndpointCommunicatorService) { }

  ngOnInit() {
    this.queryResult = this._endpointCommunicator.lastQueryResult;
  }

  handleCopyResult() {
    copyToClipboard(this.queryResult);
  }
}
