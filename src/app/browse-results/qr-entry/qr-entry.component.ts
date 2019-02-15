import { Component, Input, OnInit } from '@angular/core';
import { QueryResult } from '../../query-result/query-result';

@Component({
  selector: 'app-qr-entry',
  templateUrl: './qr-entry.component.html',
  styleUrls: ['./qr-entry.component.css']
})
export class QrEntryComponent implements OnInit {

  @Input() queryResult: QueryResult;

  constructor() { }

  ngOnInit() {
  }

}
