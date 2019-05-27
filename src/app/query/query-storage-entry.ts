import { Query } from './query';

export interface QueryStorageEntry {
  _id: string;
  _name: string;
  _description: string;
  _tags: string[];
  _endpoint: string;
  _content: string;
  _params: string[];
  _created: number;
  _lastRun: number;
  _runCount: number;
}

/**
 * Metoda převede vstup na Query
 *
 * @param input Naparsovaný dotaz
 * @param isRemote True, pokud se jedná o dotaz uložený v Cloudu, jinak false
 */
export function parseQuery(input: QueryStorageEntry, isRemote: boolean = false): Query {
  return new Query(input._id, input._name, input._endpoint,
    input._tags, input._content, input._params, input._description,
    input._created, input._lastRun, input._runCount, isRemote);
}

/**
 * Převede instanci třídy Query na rozhraní QueryStorageEntry
 * toto rozhraní slouží k uložení do paměti
 *
 * @param query Doraz, který se má encodovat
 */
export function encodeQuery(query: Query): QueryStorageEntry {
  return JSON.parse(JSON.stringify(query, Query.structureGuard));
}

/**
 * Převede pole instancí třídy Query[] na pole rozhraní QueryStorageEntry[]
 *
 * @param queries Dotazy, které se mají encodovat
 */
export function encodeQueries(queries: Query[]): QueryStorageEntry[] {
  return JSON.parse(JSON.stringify(queries, Query.structureGuard));
}
