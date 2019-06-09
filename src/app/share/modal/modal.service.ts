import { Injectable } from '@angular/core';
import { ModalComponent } from './modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {

  private _modals: ModalComponent[] = [];

  add(modal: ModalComponent) {
    if (modal === undefined) {
      return;
    }

    this._modals.push(modal);
  }

  remove(id: string) {
    this._modals = this._modals.filter(x => x.id !== id);
  }

  open(id: string) {
    const modal: any = this._modals.filter(x => x.id === id)[0];
    modal.open();
  }

  close(id: string) {
    const modal: any = this._modals.filter(x => x.id === id)[0];
    modal.close();
  }
}
