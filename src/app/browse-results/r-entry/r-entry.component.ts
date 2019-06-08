import { Component, Input, OnInit } from '@angular/core';
import { QueryResult } from '../../query-result/query-result';
import { SettingsService } from '../../settings/settings.service';
import { TimeFormat } from '../../share/time.pipe';
import { animation } from './r-entry.animation';

@Component({
  selector: 'app-qr-entry',
  templateUrl: './r-entry.component.html',
  styleUrls: ['./r-entry.component.css'],
  animations: [
    animation
  ]
})
export class REntryComponent implements OnInit {

  @Input() queryResult: QueryResult;

  constructor(private _settings: SettingsService) { }

  ngOnInit() {
  }

  get timeFormat(): TimeFormat {
    return this._settings.queryResultTimeFormat;
  }

}
