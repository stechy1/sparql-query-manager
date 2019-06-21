import { ServerResponceParser } from '../server-responce-parser';
import { JsonParser } from './parsers/json-parser';
import { ResponceFormat } from '../../responce.format';
import { XmlParser } from './parsers/xml-parser';
import { CsvParser } from './parsers/csv-parser';

export class ApacheFusekiJenaParser implements ServerResponceParser {

  private readonly _serverResponceParserImpl: ServerResponceParser;

  constructor(private readonly _responce: string, private readonly _responceFormat: ResponceFormat) {
    switch (_responceFormat) {
      case ResponceFormat.JSON:
        this._serverResponceParserImpl = new JsonParser(_responce);
        break;
      case ResponceFormat.XML:
        this._serverResponceParserImpl = new XmlParser(_responce);
        break;
      case ResponceFormat.CSV:
        this._serverResponceParserImpl = new CsvParser(_responce);
        break;
      case ResponceFormat.TSV:
        this._serverResponceParserImpl = new CsvParser(_responce, '\t');
        break;
      default:
        console.error('Neznámý formát výsledku dotazu!');
        throw Error('Neznámý formát výsledku: ' + _responce);
    }
  }

  countOfConstruct(): number {
    return this._serverResponceParserImpl.countOfConstruct();
  }

  countOfSelect(): number {
    return this._serverResponceParserImpl.countOfSelect();
  }

}
