import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { DateTimeFormat } from '../share/date-time-format';

interface Settings {
  suffix: string;
  serverTimeout: number;
  useSaveDelay: boolean;
  saveDelay: number;
  queryResultTimeFormat: DateTimeFormat;
  queryParameterFormat: QueryParameterFormat;
  defaultExportFileName: string;
  fuseKeys: string[];
  useGestures: boolean;
  alwaysShowImportDialog: boolean;
  corsHack: boolean;
  corsURL: string;
}

interface QueryParameterFormat {
  prefix: string;
  suffixIsPrefix: boolean;
  suffix: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // Konstanta obsahující název klíče, pod který se ukládá nastavení aplikace
  static readonly STORAGE_KEY = 'settings';
  static readonly DEFAULT_SETTINGS: Settings = window['__env'] && window['__env'].defaultUserSettings
    ? window['__env'].defaultUserSettings
    : {
      suffix: ' - (Duplicated)',
      serverTimeout: 5000,
      useSaveDelay: true,
      saveDelay: 250,
      queryResultTimeFormat: {
        showHours: false,
        showMinutes: false,
        showSeconds: true,
        showMiliseconds: true
      },
      queryParameterFormat: {
        prefix: '$',
        suffixIsPrefix: true,
        suffix: '$'
      },
      defaultExportFileName: 'queries.json',
      fuseKeys: ['name', 'tags'],
      useGestures: true,
      alwaysShowImportDialog: false,
      corsHack: true,
      corsURL: 'https://cors-anywhere.herokuapp.com'
    };

  // Instance nastavení
  private readonly _settings: Settings;

  constructor(private _storage: LocalStorageService) {
    // Vytažení nastavení z localStorage, nebo použití výchozího nastavení
    this._settings = this._storage.get<Settings>(SettingsService.STORAGE_KEY) || SettingsService.DEFAULT_SETTINGS;
    // Registrace globálního listeneru pro localStorage
    window.addEventListener('storage', ($event) => this._globalStorageEventListener($event.key, $event.newValue));
  }

  /**
   * Privátní globální listener pro poslouchání změny obsahu nastavení v LocalStorage napříč instancemi aplikace
   *
   * @param key Klíč, pod kterým se změnila hodnota
   * @param newValue Nová hodnota
   */
  private _globalStorageEventListener(key: string, newValue: string) {
    if (key.indexOf(SettingsService.STORAGE_KEY) === -1) {
      return;
    }

    if (JSON.stringify(this._settings) !== newValue) {
      const newSettings = <Settings>JSON.parse(newValue);
      for (const settingsKey of Object.keys(this._settings)) {
        this._settings[settingsKey] = newSettings[settingsKey];
      }
    }
  }

  public save(): void {
    this._storage.set(SettingsService.STORAGE_KEY, this._settings);
  }

  /**
   * Vymaže veškerá uložená data aplikace.
   */
  public deleteLocalStorage(): Promise<void> {
    return new Promise<void>(resolve => {
      const success = this._storage.clearAll();
      if (!success) {
        throw new Error('Data se nepodařilo smazat!');
      }
      resolve();
    });
  }

  get suffixForDuplicatedQuery(): string {
    return this._settings.suffix;
  }

  set suffixForDuplicatedQuery(suffix: string) {
    this._settings.suffix = suffix;
  }

  get serverTimeout(): number {
    return this._settings.serverTimeout;
  }

  set serverTimeout(timeout: number) {
    this._settings.serverTimeout = timeout;
  }

  get useSaveDelay(): boolean {
    return this._settings.useSaveDelay;
  }

  set useSaveDelay(use: boolean) {
    this._settings.useSaveDelay = use;
  }

  get saveDelay(): number {
    return this._settings.saveDelay;
  }

  set saveDelay(delay: number) {
    this._settings.saveDelay = delay;
  }

  get queryResultTimeFormat(): DateTimeFormat {
    return this._settings.queryResultTimeFormat;
  }

  set queryResultTimeFormat(format: DateTimeFormat) {
    this._settings.queryResultTimeFormat = format;
  }

  get queryParameterFormat(): QueryParameterFormat {
    return this._settings.queryParameterFormat;
  }

  set queryParameterFormat(format: QueryParameterFormat) {
    this._settings.queryParameterFormat = format;
  }

  get defaultExportFileName(): string {
    return this._settings.defaultExportFileName;
  }

  set defaultExportFileName(fileName: string) {
    this._settings.defaultExportFileName = fileName;
}

  get fuseKeys(): string[] {
    return this._settings.fuseKeys;
  }

  set fuseKeys(keys: string[]) {
    this._settings.fuseKeys = keys;
  }

  get useGestures(): boolean {
    return this._settings.useGestures;
  }

  set useGestures(useGestures: boolean) {
    this._settings.useGestures = useGestures;
  }

  get alwaysShowImportDialog(): boolean {
    return this._settings.alwaysShowImportDialog;
  }

  set alwaysShowImportDialog(alwaysShowImportDialog: boolean) {
    this._settings.alwaysShowImportDialog = alwaysShowImportDialog;
  }

  get corsHack(): boolean {
    return this._settings.corsHack;
  }

  set corsHack(corsHack: boolean) {
    this._settings.corsHack = corsHack;
  }

  get corsURL(): string {
    return this._settings.corsURL;
  }

  set corsURL(corsURL: string) {
    this._settings.corsURL = corsURL;
  }
}
