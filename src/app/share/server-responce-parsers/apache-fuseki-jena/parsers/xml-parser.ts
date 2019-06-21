import { ServerResponceParser } from '../../server-responce-parser';

import { parse } from 'fast-xml-parser';

interface XMLResult {
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

// <?xml version="1.0"?>
// <sparql xmlns="http://www.w3.org/2005/sparql-results#">
// <head>
//   <variable name="class"/>
// <variable name="label"/>
// <variable name="description"/>
// </head>
// <results>
// <result>
//   <binding name="class">
//   <uri>http://www.europeana.eu/schemas/edm/WebResource</uri>
// </binding>
// <binding name="label">
// <literal>Nettressurs</literal>
// </binding>
// </result>
// <result>
// <binding name="class">
//   <uri>http://www.europeana.eu/schemas/edm/WebResource</uri>
// </binding>
// <binding name="label">
//   <literal xml:lang="en">Web Resource</literal>
// </binding>
// </result>
// </results>
// </sparql>

export class XmlParser implements ServerResponceParser {

  private _constructs = 0;
  private _selects = 0;

  constructor(private readonly _responce: string) {
    this._parseResponce();
  }

  private _parseResponce() {
    const obj = <XMLResult>parse(this._responce);
    console.log(obj);
    this._constructs = obj.sparql.results.result.length;
  }

  countOfConstruct(): number {
    return this._constructs;
  }

  countOfSelect(): number {
    return this._selects;
  }
}
