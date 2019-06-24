import { ServerResponceParser } from '../../server-responce-parser';

import { parse } from 'fast-xml-parser';
import { TripleType } from '../../triple-type';

interface XMLSelectResult {
  sparql: {
    head: {
      variable: string[]
    },
    results: {
      result: {

      }[]
    }
  };
}

export class XmlParser implements ServerResponceParser {

  private _triples = 0;

  constructor(private readonly _responce: string, tripleType: TripleType) {
    this._parseResponce(tripleType);
  }

  private _parseResponce(tripleType: TripleType) {
    if (tripleType === TripleType.SELECT) {
      const obj = <XMLSelectResult>parse(this._responce);
      this._triples = obj.sparql.results.result.length;
    } else {
      console.error('Jiný typ dotazu zatím není podporovaný.');
    }
  }

  countOfTriples(): number {
    return this._triples;
  }
}
