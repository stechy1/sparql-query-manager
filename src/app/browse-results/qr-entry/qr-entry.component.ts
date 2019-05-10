import { Component, Input, OnInit } from '@angular/core';
import { QueryResult } from '../../query-result/query-result';
import { SettingsService } from '../../settings/settings.service';
import { TimeFormat } from '../../time.pipe';

@Component({
  selector: 'app-qr-entry',
  templateUrl: './qr-entry.component.html',
  styleUrls: ['./qr-entry.component.css']
})
export class QrEntryComponent implements OnInit {

  @Input() queryResult: QueryResult;

  constructor(private _settings: SettingsService) { }

  ngOnInit() {
  }

  get timeFormat(): TimeFormat {
    return this._settings.queryResultTimeFormat;
  }

}
