import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../../query/query';
import { DeleteHandler, FirebaseHandler } from '../handlers';
import { Observable } from 'rxjs';

export class GroupInfo {
  checked: string;
}

@Component({
  selector: 'app-q-group',
  templateUrl: './q-group.component.html',
  styleUrls: ['./q-group.component.css']
})
export class QGroupComponent implements OnInit {

  // Hodnoty, podle kterých se budou dotazy seskupovat
  @Input() values: string[];
  // Pole dotazů
  @Input() queries: Query[];
  // Podle čeho je dotaz seřazen
  @Input() sortedBy: Observable<string>;
  // Filtrovací funkce
  @Input() filterFunction: Function;
  // Událost, která se zavolá v případě, že uživatel bude chtít smazat dotaz
  @Output() deleteRequest = new EventEmitter<DeleteHandler>();
  // Událost, která se zavolá v případě, že uživatel chce komunikovat s firebase
  @Output() firebaseRequest = new EventEmitter<FirebaseHandler>();
  // Událost, která se zavolá v případě, že uživatel chce editovat dotaz
  @Output() editRequest = new EventEmitter<string>();

  // Objekt s informacemi o skupině
  groupInformations = {};

  constructor() { }

  ngOnInit() {
    // Projdu všechny hodnoty, podle kterých budu seskupovat dotazy
    for (const value of this.values) {
      // A vytvořím k nim novou instanci třídy GroupInfo
      this.groupInformations[value] = new GroupInfo();
    }
  }

  /**
   * Reakce na tlačítko pro smazání dotazu
   *
   * @param deleteHandler Informace o události
   */
  handleDeleteRequest(deleteHandler: DeleteHandler) {
    this.deleteRequest.emit(deleteHandler);
  }

  /**
   * Reakce na tlačítko pro práci s firebase
   *
   * @param firebaseHandler Informace o události
   */
  handleFirebaseRequest(firebaseHandler: FirebaseHandler) {
    this.firebaseRequest.emit(firebaseHandler);
  }

  /**
   * Reakce na změnu zaškrtnutí checkboxu reprezentujícího celou skupinu
   *
   * @param event Událost
   */
  handleCheckboxChange(event: Event) {
    // Získám referenci na zdroj události
    const srcElement = (<HTMLInputElement> event.srcElement);
    // Zjistím, zda-li je checkbox zaškrtnutý
    const checked = srcElement.checked;
    // Získám hodnotu checkboxu
    const value = srcElement.value;

    // Projdu všechny dotazy ve skupině a nastavím jím stejný příznak select
    this.getQueries(value).forEach(query => query.selected = checked);
    // To samé provedu v dané skupině
    this.groupInformations[value].checked = checked;
  }

  /**
   * Reakce na tlačítko pro editaci dotazu
   *
   * @param id ID dotazu, který se má editovat
   */
  handleEditRequest(id: string) {
    this.editRequest.emit(id);
  }

  getQueries(value: string): Query[] {
    return this.queries.filter(query => this.filterFunction(query, value));
  }
}
