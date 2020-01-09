import { findTripleType, TripleType } from '../share/server-responce-parsers/triple-type';

export class QueryResult {

  private readonly _tripleType: TripleType;

  constructor(private _id, private _name: string, private _content: string, private _result: string, private _params: {},
              private _resultState: ResultState, private _dateOfRun: number, private _runLength: number,
              private _countOfTriples: number, private _format) {
    this._tripleType = findTripleType(_content);
  }

  get id() {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get content(): string {
    return this._content;
  }

  get result(): string {
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

  get countOfTriples(): number {
    return this._countOfTriples;
  }

  get tripleType(): TripleType {
    return this._tripleType;
  }

  get format(): string {
    return this._format;
  }

  get isOk(): boolean {
    return this._resultState === ResultState.OK;
  }

  get dateOfRunAsDate(): Date {
    return new Date(this.dateOfRun);
  }
}

export enum ResultState {
  OK, KO
}

