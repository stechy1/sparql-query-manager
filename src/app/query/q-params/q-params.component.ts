import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-q-params',
  templateUrl: './q-params.component.html',
  styleUrls: ['./q-params.component.css']
})
export class QParamsComponent implements OnInit {

  static readonly PARAMETER_SEPARATOR = '$';

  @Input() params = {};
  @Input() content = '';

  constructor() { }

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

  findVariables(content: string, params: {}) {
    // if (Object.keys(params).length === 0) { // Parametry nebyly nalezeny, nebo žádné neexistují
      if (content.length === 0) { // Není tu žádný obsah, nemá smysl hledat nějaké parametry
        console.log('Obsah dotazu je prázdný, nemá smysl hledat parametry...');
        return;
      }

      const separatorIndexes = QParamsComponent.getIndicesOf(QParamsComponent.PARAMETER_SEPARATOR, content);
      if (separatorIndexes.length % 2 !== 0) {
        prompt(`Všechny parametry musí but obaleny znakem ${QParamsComponent.PARAMETER_SEPARATOR} z obou stran!`);
        return;
      }

      for (let i = 0; i < separatorIndexes.length; i += 2) {
        const variable = content.substring(separatorIndexes[i] + 1, separatorIndexes[i + 1]);
        console.log(variable);
        if (!this.params[variable]) {
          this.params[variable] = {'defaultValue': '', 'usedValue': ''};
        } else {
          this.params[variable] = params[variable];
        }
      }

      this.content = content;
    // }
  }

  get keys(): string[] {
    return Object.keys(this.params);
  }

  handleDefaultValueChange(event: string | number, key: string) {
    this.params[key]['defaultValue'] = event;
  }

  handleUsedValueChange(event: string | number, key: string) {
    this.params[key]['usedValue'] = event;
  }
}
