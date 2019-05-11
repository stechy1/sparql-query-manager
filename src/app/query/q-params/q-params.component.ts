import { Component, Input, OnInit } from '@angular/core';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-q-params',
  templateUrl: './q-params.component.html',
  styleUrls: ['./q-params.component.css']
})
export class QParamsComponent implements OnInit {

  @Input() params = {};
  @Input() content = '';

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
    this.findVariables(this.content, this.params);
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
      if (!this.params[variable]) {
        this.params[variable] = {'defaultValue': '', 'usedValue': ''};
      } else {
        if (params[variable]) {
          this.params[variable] = params[variable];
        }
      }
    }

    this.content = content;
    return this.params;
  }

  get keys(): string[] {
    return Object.keys(this.params);
  }

  get variablesWithoutUnused(): {} {
    const result = {};

    for (const param in this.params) {
      if (this.content.indexOf(`${this._settings.queryParameterFormat.prefix}${param}${this._settings.queryParameterFormat.suffix}`) !== -1) {
        result[param] = this.params[param];
      }
    }

    return result;
  }

  isParameterToRemove(parameter: string): boolean {
    return this.variablesWithoutUnused[parameter] === undefined;
  }

  handleDefaultValueChange(event: string | number, key: string) {
    this.params[key]['defaultValue'] = event;
  }

  handleUsedValueChange(event: string | number, key: string) {
    this.params[key]['usedValue'] = event;
  }
}
