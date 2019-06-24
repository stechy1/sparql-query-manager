import { ServerResponceParser } from '../server-responce-parser';
import { JsonParser } from './parsers/json-parser';
import { ResponceFormat } from '../../responce.format';
import { XmlParser } from './parsers/xml-parser';
import { CsvParser } from './parsers/csv-parser';
import { findTripleType, TripleType } from '../triple-type';

export class ApacheFusekiJenaParser implements ServerResponceParser {

  private readonly _serverResponceParserImpl: ServerResponceParser;

  constructor(tripleType: TripleType, responce: string, responceFormat: ResponceFormat) {
    switch (responceFormat) {
      case ResponceFormat.JSON:
        this._serverResponceParserImpl = new JsonParser(responce, tripleType);
        break;
      case ResponceFormat.XML:
        this._serverResponceParserImpl = new XmlParser(responce, tripleType);
        break;
      case ResponceFormat.CSV:
        this._serverResponceParserImpl = new CsvParser(responce, tripleType);
        break;
      case ResponceFormat.TSV:
        this._serverResponceParserImpl = new CsvParser(responce, tripleType, '\t');
        break;
      default:
        console.error('Neznámý formát výsledku dotazu!');
        throw Error('Neznámý formát výsledku: ' + responce);
    }
  }

  countOfTriples(): number {
    return this._serverResponceParserImpl.countOfTriples();
  }

}
