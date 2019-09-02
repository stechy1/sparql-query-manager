import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Query } from '../../query/query';
import { DeleteHandler, FirebaseHandler, FirebaseHandlerType } from '../handlers';
import { animation, swipeLeft } from './q-entry.animation';
import { SettingsService } from '../../settings/settings.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-q-entry',
  templateUrl: './q-entry.component.html',
  styleUrls: ['./q-entry.component.css'],
  animations: [
    animation,
    swipeLeft
  ]
})
export class QEntryComponent implements OnInit, AfterViewInit, OnDestroy {

  // Podle čeho je dotaz seřazen
  @Input() sortedBy: Observable<string>;
  // Událost, která se zavolá v případě, že uživatel bude chtít smazat dotaz
  @Output() deleteRequest = new EventEmitter<DeleteHandler>();
  // Událost, která se zavolá v případě, že uživatel chce komunikovat s firebase
  @Output() firebaseRequest = new EventEmitter<FirebaseHandler>();
  // Událost, která se zavolá v případě, že uživatel chce editovat dotaz
  @Output() editRequest = new EventEmitter<string>();
  // Událost, která se zavolá v případě, že uživatel přejel přes položku doleva
  @Output() swipeLeftRequest = new EventEmitter<Query>();

  // Stav pro animaci
  querySwipe: string;
  orderedByValue: Date|number;
  showOrderedBy = false;

  // Lokální reference na dotaz
  private _query: Query;
  // True, pokud jsou povolená gesta, jinak false
  private _enableGestures: boolean;
  private _orderedBySubscription: Subscription;

  constructor(private _settings: SettingsService) {
    this._enableGestures = false;
  }

  ngOnInit() {
    this._orderedBySubscription = this.sortedBy.subscribe(sortedBy => {
      console.log(sortedBy);
      switch (sortedBy) {
        case 'last_run':
          this.orderedByValue = new Date(this._query.lastRun);
          break;
        case 'date_of_creation':
          this.orderedByValue = new Date(this._query.created);
          break;
        case 'count_of_run':
          this.orderedByValue = this._query.runCount;
          break;
        default:
          this.orderedByValue = 0;
          break;
      }
      this.showOrderedBy = sortedBy === 'last_run'
        || sortedBy === 'date_of_creation'
        || sortedBy === 'count_of_run';
    });
  }

  ngAfterViewInit(): void {
    // Pokud jsou povolená gesta
    if (this._settings.useGestures) {
      // Nastavím timeout na jednu vteřinu
      setTimeout(() => {
        // poté povolám gesta
        // je to menší hack, abych předešel nechtěnému spuštění
        this._enableGestures = true;
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this._orderedBySubscription.unsubscribe();
  }

  /**
   * Reakce na tlačítko pro smažání dotazu
   *
   * @param isRemote True, pokud chci smazat dotaz z cloudu, jinak se smaže z lokálního úložiště
   */
  handleDelete(isRemote: boolean) {
    this.deleteRequest.emit({query: this._query, isRemote: isRemote});
  }

  /**
   * Reakce na tlačítko pro nahrání dotazu do cloudu
   */
  handleUpload() {
    this.firebaseRequest.emit({query: this._query, handlerType: FirebaseHandlerType.UPLOAD});
  }

  /**
   * Reakce na tlašítko pro stažení dotazu z cloudu do lokálního úložiště
   */
  handleDownload() {
    this.firebaseRequest.emit({query: this._query, handlerType: FirebaseHandlerType.DOWNLOAD});
  }

  /**
   * Reakce na tlačítko pro editaci dotazu
   */
  handleEdit() {
    this.editRequest.emit(this._query.id);
  }

  /**
   * Reakce na spuštění gesta
   */
  handleSwipeLeft() {
    if (!this._enableGestures) {
      return;
    }
    this.querySwipe = 'slideOutLeft';
  }

  /**
   * Reakce na dokončení gesta
   */
  handleSwipeLeftDone() {
    if (!this._enableGestures) {
      return;
    }
    this.swipeLeftRequest.emit(this._query);
  }

  @Input()
  set query(value: Query) {
    this._query = value;
  }

  get query(): Query {
    return this._query;
  }

  get formatedDateOfCreation() {
    const date = new Date(this._query.created);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }
}
