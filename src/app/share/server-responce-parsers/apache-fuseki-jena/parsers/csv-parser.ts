import { ServerResponceParser } from '../../server-responce-parser';

export class CsvParser implements ServerResponceParser {

  private _constructs = 0;
  private _selects = 0;

  constructor(private readonly _responce: string, private readonly _separator = ',') {
    this._parseResponce();
  }

  private _parseResponce() {
    const obj = this._responce.split('\n');
     this._constructs = obj.length - 2;
  }

  countOfConstruct(): number {
    return this._constructs;
  }

  countOfSelect(): number {
    return this._selects;
  }
}
