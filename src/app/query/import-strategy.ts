import { parseQuery, QueryStorageEntry } from './query-storage-entry';
import { QueryService } from './query.service';

export class ImportStrategy {
  static readonly KEY = 'importStrategy';

  // Strategie přepsání lokálního záznamu za importovaný
  static readonly OVERRIDE_LOCAL = new ImportStrategy('Přepsat lokální záznam', 'override_local',
    (service: QueryService, entry: QueryStorageEntry) => {
      // Fyzicky odstraní starý dotaz a nahradí ho novým
      return service.delete(entry._id).then(() => service.create(parseQuery(entry), true));
    });
  // Strategie importu dotazu jako nového
  static readonly IMPORT_AS_NEW = new ImportStrategy('Vytvořit nový záznam', 'import_as_new',
    (service: QueryService, entry: QueryStorageEntry) => {
      // Zkusím najít dotaz
      return service.byId(entry._id)
      // Dotaz existuje
      .then((query) => {
        if (query.downloaded) {
          // Vytvořím ho tedy jako duplikovaný
          return service.duplicate(parseQuery(entry));
        } else {
          throw new Error();
        }
      })
      // Pokud neexistuje
      .catch(() => {
        // Vložím ho standartní cestou
        return service.create(parseQuery(entry), true);
      });
    });
  // Strategie nevložení dotazu
  static readonly DO_NOT_IMPORT = new ImportStrategy('Nevkládat', 'do_not_import',
    (service: QueryService, entry: QueryStorageEntry) => {
      // Nic nebudu dělat, prostě vrátím vyřešenou Promise
      return Promise.resolve();
    });

  static readonly VALUES = [
    ImportStrategy.OVERRIDE_LOCAL,
    ImportStrategy.IMPORT_AS_NEW,
    ImportStrategy.DO_NOT_IMPORT
  ];

  private constructor(private readonly _name: string, private readonly _value: string, private readonly _function: Function) {
  }

  get name(): string {
    return this._name;
  }

  get value(): string {
    return this._value;
  }

  /**
   * Použije vybranou strategii importu
   *
   * @param service Služba pro práci s dotazy
   * @param entry Importovaný záznam dotazu
   */
  applyStrategy(service: QueryService, entry: QueryStorageEntry): void {
    this._function.call(this, service, entry);
  }
}
