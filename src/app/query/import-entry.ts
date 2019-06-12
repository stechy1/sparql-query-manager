import { ImportStrategy } from './import-strategy';
import { QueryStorageEntry } from './query-storage-entry';

export class ImportEntry {

  constructor(private readonly _parent: QueryStorageEntry, private _importStrategy: string = ImportStrategy.OVERRIDE_LOCAL.value) {}

  get name(): string {
    return this._parent._name;
  }

  get queryStorageEntry(): QueryStorageEntry {
    return this._parent;
  }

  get importStrategy(): string {
    return this._importStrategy;
  }

  set importStrategy(value: string) {
    this._importStrategy = value;
  }
}

