import { QueryResult, ResultState } from './query-result';

/**
 * Rozhraní obsahující vlastnosti výsledku dotazu, které se používá k serializaci dotazu a následnému uložení do paměti
 */
export interface QueryResultStorageEntry {
  _id: string;
  _name: string;
  _content: string;
  _result: string;
  _params: {};
  _resultState: ResultState;
  _dateOfRun: number;
  _runLength: number;
  _countOfSelect: number;
  _countOfConstruct: number;
  _format: number;
}

/**
 * Metoda převede vstup na Query
 *
 * @param input Naparsovaný dotaz
 */
export function parseQueryResult(input: QueryResultStorageEntry): QueryResult {
  return new QueryResult(input._id, input._name, input._content, input._result, input._params,
    input._resultState, input._dateOfRun, input._runLength,
    input._countOfSelect, input._countOfConstruct, input._format);
}
