import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { TimeFormat } from '../time.pipe';

interface Settings {
  suffix: string;
  serverTimeout: number;
  useFirebase: boolean;
  firebaseCredentials: string;
  useSaveDelay: boolean;
  saveDelay: number;
  queryResultTimeFormat: TimeFormat;
  queryParameterFormat: QueryParameterFormat;
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

  static readonly SETTINGS_KEY = 'settings';
  static readonly DEFAULT_SETTINGS: Settings = {
    suffix: ' - (Duplicated)',
    serverTimeout: 5000,
    useFirebase: false,
    firebaseCredentials: '',
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
    }
  };

  private readonly _settings: Settings;

  constructor(private _storage: LocalStorageService) {
    // Vytažení nastavení z localStorage, nebo použití výchozího nastavení
    this._settings = this._storage.get<Settings>(SettingsService.SETTINGS_KEY) || SettingsService.DEFAULT_SETTINGS;
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
    if (key.indexOf(SettingsService.SETTINGS_KEY) === -1) {
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
    this._storage.set(SettingsService.SETTINGS_KEY, this._settings);
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

  get useFirebase(): boolean {
    return this._settings.useFirebase;
  }

  set useFirebase(useFirebase: boolean) {
    this._settings.useFirebase = useFirebase;
  }

  get firebaseCredentials(): string {
    return this._settings.firebaseCredentials;
  }

  set firebaseCredentials(credentials: string) {
    this._settings.firebaseCredentials = credentials;
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

  get queryResultTimeFormat(): TimeFormat {
    return this._settings.queryResultTimeFormat;
  }

  set queryResultTimeFormat(format: TimeFormat) {
    this._settings.queryResultTimeFormat = format;
  }

  get queryParameterFormat(): QueryParameterFormat {
    return this._settings.queryParameterFormat;
  }

  set queryParameterFormat(format: QueryParameterFormat) {
    this._settings.queryParameterFormat = format;
  }
}
