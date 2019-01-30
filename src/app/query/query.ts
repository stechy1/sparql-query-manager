export class Query {
  constructor(private _id: string, private _name: string, private _endpoint: string, private _tags: string[],
              private _content: string, private _description: string) { }

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

  addTag(tag: string): void {
    this._tags.push(tag);
  }

  removeTag(tag: string): void {
    this._tags.splice(this._tags.findIndex(value => value === tag), 1);
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
}
