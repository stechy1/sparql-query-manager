export class QueryResult {

  constructor(private _id, private _name: string, private _content: string, private _result: {}, private _params: {},
              private _resultState: ResultState, private _dateOfRun: number, private _runLength: number,
              private _countOfSelect: number, private _countOfConstruct: number) {}

  get id() {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get content(): string {
    return this._content;
  }

  get result(): {} {
    return this._result;
  }

  get params(): {} {
    return this._params;
  }

  get resultState(): ResultState {
    return this._resultState;
  }

  get dateOfRun(): number {
    return this._dateOfRun;
  }

  get runLength(): number {
    return this._runLength;
  }

  get countOfSelect(): number {
    return this._countOfSelect;
  }

  get countOfConstruct(): number {
    return this._countOfConstruct;
  }
}

export enum ResultState {
  OK, KO
}
