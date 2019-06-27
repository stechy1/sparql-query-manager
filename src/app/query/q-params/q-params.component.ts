import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-q-params',
  templateUrl: './q-params.component.html',
  styleUrls: ['./q-params.component.css']
})
export class QParamsComponent implements OnInit {

  @Input() params: Observable<{}>;
  @Input() content = '';
  @Output() dataChanged = new EventEmitter<void>();

  private _params = {};

  constructor(private _settings: SettingsService) {}

  private static getIndicesOf(searchStr, str): number[] {
    const searchStrLen = searchStr.length;
    if (searchStrLen === 0) {
      return [];
    }
    let startIndex = 0, index;
    const indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }
    return indices;
  }

  ngOnInit() {
    this.params.subscribe(value => {
      this._params = value;
    });
    // this.findVariables(this.content, this.params);
  }

  findVariables(content: string, params: {}): {} {
    if (content.length === 0) { // Není tu žádný obsah, nemá smysl hledat nějaké parametry
      return;
    }

    const prefixIndexes = QParamsComponent.getIndicesOf(this._settings.queryParameterFormat.prefix, content);
    const suffixIsPrefix = this._settings.queryParameterFormat.suffixIsPrefix;
    let suffixIndexes = [];
    if (!suffixIsPrefix) {
      suffixIndexes = QParamsComponent.getIndicesOf(this._settings.queryParameterFormat.suffix, content);
    }
    if ((prefixIndexes.length + suffixIndexes.length) % 2 !== 0) {
      prompt(`Všechny parametry musí mít prefix ${this._settings.queryParameterFormat.prefix} a suffix ${
        this._settings.queryParameterFormat.suffix}!`);
      return;
    }

    for (let i = 0, j = 0; i < prefixIndexes.length; i += (suffixIsPrefix ? 2 : 1), j++) {
      const prefix = prefixIndexes[i] + 1;
      const suffix = suffixIsPrefix ? prefixIndexes[i + 1] : suffixIndexes[j];
      if (suffix === undefined) {
        prompt(`${j}. parametr nebyl rozpoznán!`);
        continue;
      }
      const variable = content.substring(prefix, suffix);
      if (!this._params[variable]) {
        this._params[variable] = {'defaultValue': '', 'usedValue': ''};
      } else {
        if (params[variable]) {
          this._params[variable] = params[variable];
        }
      }
    }

    this.content = content;
    return this._params;
  }

  isParameterToRemove(parameter: string): boolean {
    return this.variablesWithoutUnused[parameter] === undefined;
  }

  handleDefaultValueChange(event: string | number, key: string) {
    this._params[key]['defaultValue'] = event;
    this.dataChanged.emit();
  }

  handleUsedValueChange(event: string | number, key: string) {
    this._params[key]['usedValue'] = event;
    this.dataChanged.emit();
  }

  get keys(): string[] {
    return Object.keys(this._params);
  }

  get variablesWithoutUnused(): {} {
    const result = {};

    for (const param in this._params) {
      // tslint:disable-next-line:max-line-length
      if (this.content.indexOf(`${this._settings.queryParameterFormat.prefix}${param}${this._settings.queryParameterFormat.suffix}`) !== -1) {
        result[param] = this._params[param];
      }
    }

    return result;
  }

  get parameters() {
    return this._params;
  }
}
