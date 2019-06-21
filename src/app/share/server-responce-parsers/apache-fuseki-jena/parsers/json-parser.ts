import { ServerResponceParser } from '../../server-responce-parser';

interface JSONResult {
  head: {
    vars: string[]
  };
  results: {
    bindings: {
      class: {
        type: string,
        value: string
      },
      label: {
        type: string,
        value: string
      }
    }[]
  };
}

export class JsonParser implements ServerResponceParser {

  private _constructs = 0;
  private _selects = 0;

  constructor(private readonly _responce: string) {
    this._parseResponce();
  }

  private _parseResponce() {
    const obj = <JSONResult>JSON.parse(this._responce);
    this._constructs = obj.results.bindings.length;
  }

  countOfConstruct(): number {
    return this._constructs;
  }

  countOfSelect(): number {
    return this._selects;
  }
}
