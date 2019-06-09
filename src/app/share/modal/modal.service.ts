import { Injectable } from '@angular/core';
import { ModalComponent } from './modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {

  // Kolekce modálních dialogů
  private _modals: ModalComponent[] = [];

  /**
   * Přidá nový modální dialog do správce
   *
   * @param modal Nový modální dialog
   */
  add(modal: ModalComponent) {
    if (modal === undefined) {
      return;
    }

    this._modals.push(modal);
  }

  /**
   * Odstraní modální dialog podle jeho ID
   *
   * @param id ID dialogu, který má být odstraněn
   */
  remove(id: string) {
    this._modals = this._modals.filter(x => x.id !== id);
  }

  /**
   * Otevře dialog v read-only režimu
   *
   * @param id ID dialogu, který se má otevřít
   */
  open(id: string) {
    const modal: ModalComponent = this._modals.filter(x => x.id === id)[0];
    modal.open();
  }

  /**
   * Otevře dialog s čekáním na výsledek
   *
   * @param id ID dialogu, který se má otevřít
   */
  openForResult(id: string): Promise<any> {
    const modal: ModalComponent = this._modals.filter(x => x.id === id)[0];
    return modal.openForResult();
  }

  /**
   * Zavře vybraný dialog
   *
   * @param id ID dialogu, který se má zavřít
   */
  close(id: string) {
    const modal: ModalComponent = this._modals.filter(x => x.id === id)[0];
    modal.close();
  }
}
