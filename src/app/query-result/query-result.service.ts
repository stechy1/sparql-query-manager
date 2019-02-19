import { EventEmitter, Injectable } from '@angular/core';
import { QueryResult, ResultState } from './query-result';
import { LocalStorageService } from 'angular-2-local-storage';

interface QueryResultStorageEntry {
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
}

@Injectable({
  providedIn: 'root'
})
export class QueryResultService {

  // Konstanta obsahující název klíče, pod který se ukládají data o dotazech do local storage
  static readonly STORAGE_KEY = 'query-results';

  private _results = new Array<QueryResult>();
  // private _resultsCollectionChange = new EventEmitter();

  constructor(private _storage: LocalStorageService) {
    this._loadQueryResults();
  }

  /**
   * Metoda převede vstup na Query
   *
   * @param input Naparsovaný dotaz
   */
  private static parseQueryResult(input: QueryResultStorageEntry): QueryResult {
    return new QueryResult(input._id, input._name, input._content, input._result, input._params,
      input._resultState, input._dateOfRun, input._runLength,
      input._countOfSelect, input._countOfConstruct);
  }

  /**
   * Interní metoda pro načtení dotazů do paměti
   *
   * @param queries Pole dotazů
   */
  private _loadQueryResultsInternal(queries: QueryResultStorageEntry[]): void {
    for (const rawQuery of queries) {
      const query = QueryResultService.parseQueryResult(rawQuery);
      this._results.push(query);
      // this._resultsCollectionChange.emit({typeOfChange: TypeOfQueryChange.ADD, query: query});
    }
  }

  /**
   * Načte data z localStorage
   */
  private _loadQueryResults(): void {
    const dataRaw = this._storage.get<QueryResultStorageEntry[]>(QueryResultService.STORAGE_KEY) || new Array<QueryResultStorageEntry>();
    this._loadQueryResultsInternal(dataRaw);
  }

  /**
   * Uloží data do localStorage
   */
  private _saveQueryResults(): void {
    this._storage.set(QueryResultService.STORAGE_KEY, JSON.parse(JSON.stringify(this._results)));
  }

  allQueryResults(): QueryResult[] {
    return this._results;
  }

  add(result: QueryResult) {
    this._results.push(result);
    this._saveQueryResults();
  }

  byId(id: string): QueryResult {
  return this._results.find(value => value.id === id);
  }
}
