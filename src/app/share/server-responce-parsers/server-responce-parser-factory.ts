import { ServerResponceParser } from './server-responce-parser';
import { ApacheFusekiJenaParser } from './apache-fuseki-jena/apache-fuseki-jena-parser';
import { Query } from '../../query/query';
import { ResponceFormat } from '../responce.format';
import { findTripleType } from './triple-type';

export function getResponceParser(query: string, responce: string, responceFormat: ResponceFormat): ServerResponceParser {
  const tripleType = findTripleType(query);

  return new ApacheFusekiJenaParser(tripleType, responce, responceFormat);
}
