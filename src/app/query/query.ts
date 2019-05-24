export class ParameterValue {
  defaultValue: string;
  usedValue: string;
}

export class Query {

  private _selected = false;

  constructor(private _id: string, private _name: string, private _endpoint: string, private _tags: string[],
              private _content: string,  private _params: {}, private _description: string,
              private _created: number, private _lastRun: number, private _runCount: number, private _isRemote: boolean = false) {
  }

  static structureGuard(key: string, value: any) {
    switch (key) {
      case '_selected':
      case '_isRemote':
        return undefined;
      default:
        return value;
    }
  }

  usedParams(): {} {
    const result = {};
    for (const key of Object.keys(this._params)) {
      const param = <ParameterValue> this._params[key];
      result[key] = (param.usedValue) ? param.usedValue : param.defaultValue;
    }

    return result;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get endpoint(): string {
    return this._endpoint;
  }

  set endpoint(value: string) {
    this._endpoint = value;
  }

  get tags(): string[] {
    return this._tags;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get created(): number {
    return this._created;
  }

  set created(created: number) {
    this._created = created;
  }

  get lastRun(): number {
    return this._lastRun;
  }

  set lastRun(value: number) {
    this._lastRun = value;
  }

  get runCount() {
    return this._runCount;
  }

  set runCount(value) {
    this._runCount = value;
  }

  get params(): {} {
    return this._params;
  }

  set params(value: {}) {
    this._params = value;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  // Firebase support
  // ----------------------------------------

  get isRemote(): boolean {
    return this._isRemote;
  }
}
