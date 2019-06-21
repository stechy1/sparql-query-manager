import { ServerResponceParser } from './server-responce-parser';
import { ApacheFusekiJenaParser } from './apache-fuseki-jena/apache-fuseki-jena-parser';
import { Query } from '../../query/query';
import { ResponceFormat } from '../responce.format';

export class ServerResponceParserFactory {

  getResponceParser(query: Query, responce: string, responceFormat: ResponceFormat): ServerResponceParser {
    return new ApacheFusekiJenaParser(responce, responceFormat);
  }

}
