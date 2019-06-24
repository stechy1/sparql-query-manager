import { ServerResponceParser } from '../../server-responce-parser';
import { TripleType } from '../../triple-type';

interface JSONSelectResult {
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

  private _triples = 0;

  constructor(private readonly _responce: string, tripleType: TripleType) {
    this._parseResponce(tripleType);
  }

  private _parseResponce(tripleType: TripleType) {
    if (tripleType === TripleType.SELECT) {
      const obj = <JSONSelectResult>JSON.parse(this._responce);
      this._triples = obj.results.bindings.length;
    } else {
      console.error('Jiný typ dotazu zatím není podporovaný.');
    }
  }

  countOfTriples(): number {
    return this._triples;
  }
}
