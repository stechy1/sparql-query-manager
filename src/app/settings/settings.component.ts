import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  testTime: number;

  constructor(public settings: SettingsService, private _toastr: ToastrService, private _router: Router) { }

  ngOnInit() {
    this.testTime = Date.now();
  }

  handleSave() {
    this.settings.save();
    this._toastr.success('Nastavení bylo uloženo.');
  }

  refreshTime() {
    this.testTime = Date.now();
  }

  handlePrefixChange($event: string) {
    this.settings.queryParameterFormat.prefix = $event;
    if (this.settings.queryParameterFormat.suffixIsPrefix) {
      this.settings.queryParameterFormat.suffix = $event;
    }
  }

  handleSuffixIsPrefix($event: Event) {
    const suffixIsprefix = (<HTMLInputElement>$event.srcElement).checked;
    if (suffixIsprefix) {
      this.settings.queryParameterFormat.suffix = this.settings.queryParameterFormat.prefix;
    }
  }

  handleDeleteAll() {
    if (confirm('Opravdu si přejete vymazat veškerá data?')) {
      this.settings
        .deleteLocalStorage()
        .then(_ => {
          this._toastr.success('Data byla vymazána.');
          this._router.navigate(['/']);
        })
        .catch(reason => {
          this._toastr.error(reason);
        });
    }
  }
}
