import { ServerResponceParser } from '../../server-responce-parser';
import { TripleType } from '../../triple-type';

export class CsvParser implements ServerResponceParser {

  private _triples = 0;

  constructor(private readonly _responce: string, tripleType: TripleType, private readonly _separator = ',') {
    this._parseResponce(tripleType);
  }

  private _parseResponce(tripleType: TripleType) {
    if (tripleType === TripleType.SELECT) {
      const obj = this._responce.split('\n');
      this._triples = obj.length - 2;
    } else {
      console.error('Jiný typ dotazu zatím není podporovaný.');
    }
  }

  countOfTriples(): number {
    return this._triples;
  }
}
