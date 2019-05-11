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
  queryParameterFormat: string;
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
    queryParameterFormat: '$VARIABLE_NAME$'
  };

  private readonly _settings: Settings;

  constructor(private _storage: LocalStorageService) {
    this._settings = this._storage.get<Settings>(SettingsService.SETTINGS_KEY) || SettingsService.DEFAULT_SETTINGS;
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

  get queryParameterFormat(): string {
    return this._settings.queryParameterFormat;
  }

  set queryParameterFormat(format: string) {
    this._settings.queryParameterFormat = format;
  }
}
