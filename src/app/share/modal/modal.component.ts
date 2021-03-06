import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { ModalService } from './modal.service';
import { animation } from './modal.animation';
import { Observable, Subscription } from 'rxjs';
import { ModalType } from './modal-type';

/**
 * Komponenta reprezentující modální dialog
 * Dialog disponuje dvěma tlačítky: <b>zrušit</b>, <b>potvrdit</b>.
 *
 * Pracuje ve dvou módech:
 *  - read-only - pouze pro zobrazení informace
 *  - s čekáním na výsledek - předpokládá se nějaká interakce v dialogu s výsledkem
 *
 * V read-only režimu je vhodné dialog použít takto:
 *  <pre>
 *    <app-modal id="informationModalDialog" title="Informace"
 *      (confirm)="handleConfirmInformationDialog()"
 *      (cancel)="handleCnacelConfirmationDialog()">
 *      <app-import-dialog></app-import-dialog>
 *    </app-modal>
 *  </pre>
 *
 *  Pro čekání na výsledek je potřeba spárovat proměnnou 'result':
 *  <pre>
 *    <app-modal id="modalContainer" title="Import dotazů"
 *      [result]="importDialog.entries"
 *      (confirm)="importDialog.doImport()">
 *      <app-import-dialog #importDialog></app-import-dialog>
 *    </app-modal>
 *  </pre>
 *
 * V druhém případě se výsledek musí získat právě z komponenty uvnitř dialogu,
 * proto se nabinduje metoda 'confirm', která informuje komponentu v dialogu,
 * že má poskytnout výsledek do 'spárované' proměnné.
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    animation
  ]
})
export class ModalComponent implements OnInit, OnDestroy {

  // ID dialogu
  @Input() id: string;
  // Titulek dialogu
  @Input() title: string;
  // Text v potvrzovacím tlačítku
  @Input() confirmText = 'Použít';
  // Text v cancel tlačítku
  @Input() cancelText = 'Zrušit';
  // Typ modálního okna
  @Input() modalType = ModalType.SUCCESS;
  // Pozorovatelný výsledek, který se použije v metodě openForResult
  @Input() result: Observable<any>;
  // Zrušení akce v dialogu
  @Output() cancel = new EventEmitter<void>();
  // Potvrzení akce v dialogu
  @Output() confirm = new EventEmitter<void>();

  // Reference na komponentu dialogu
  private readonly element: any;
  // Příznak, který říká, zda-li je dialog otevřený
  private _isOpen = false;
  // Pomocná reference na odběr výsledku
  private _resultSubscription: Subscription;
  // Pomocná reference na odběr akce zrušení dialogu
  private _cancelSubscription: Subscription;

  constructor(private _modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  /**
   * Odhlásí z odběru subscription result a cancel události
   */
  private _unsubscrie() {
    if (this._resultSubscription) {
      this._resultSubscription.unsubscribe();
      this._resultSubscription = null;
    }
    if (this._cancelSubscription) {
      this._cancelSubscription.unsubscribe();
      this._cancelSubscription = null;
    }
  }

  ngOnInit(): void {
    // Ujistím se, že dialog má nastavené ID
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    // Vložím dialog až na samý konec DOMu
    document.body.appendChild(this.element);
    // Přidám dialog do správce dialogů
    this._modalService.add(this);
  }

  ngOnDestroy(): void {
    // Dialog již není používán, tak ho odeberu ze správce dialogů
    this._modalService.remove(this.id);
    // Teď ho odeberu z DOMu
    this.element.remove();
    this._unsubscrie();
  }

  /**
   * Otevře dialog bez čekání na výsledek
   */
  open(): void {
    // Nastaví příznak na otevřeno
    this._isOpen = true;
    // Přidá třídu 'modal-open' do elementu 'body'
    document.body.classList.add('modal-open');
  }

  /**
   * Otevře dialog s čekáním na výsledek
   */
  openForResult(): Promise<any> {
    // Odhlásím z odběru předchozí odběratele
    this._unsubscrie();
    // Vrátím novou promise
    return new Promise<any>((resolve, reject) => {
      // Otevřu dialog
      this.open();
      // Přihlásím se k odběru výsledku
      this._resultSubscription = this.result.subscribe((value) => {
        // Příjde-li výsledek, považuji to za úspěšné vyřešení dialogu
        resolve(value);
      });
      // Přihlásím se k odběru zrušení dialogu
      this._cancelSubscription = this.cancel.subscribe(() => {
        // Příjde-li zrušení, považuji to za zrušení celého dialogu
        reject();
      });
    });
  }

  /**
   * Zavře dialog
   */
  close(): void {
    this._isOpen = false;
    document.body.classList.remove('modal-open');
    this.cancel.emit();
  }

  /**
   * Reakce na tlačítko cancel
   */
  handleCancel() {
    this.close();
  }

  /**
   * Reakce na tlačítko pro potvrzení
   */
  handleConfirm() {
    this.confirm.emit();
    this._isOpen = false;
    document.body.classList.remove('modal-open');
  }

  get isOpen(): boolean {
    return this._isOpen;
  }
}
