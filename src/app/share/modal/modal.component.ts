import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { ModalService } from './modal.service';
import { animation } from './modal.animation';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    animation
  ]
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() title: string;
  @Input() result: Observable<any>;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  private readonly element: any;
  private _isOpen = false;
  private _resultSubscription: Subscription;
  private _cancelSubscription: Subscription;

  constructor(private _modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    document.body.appendChild(this.element);
    this._modalService.add(this);
  }

  ngOnDestroy(): void {
    this._modalService.remove(this.id);
    this.element.remove();
  }

  open(): void {
    this._isOpen = true;
    document.body.classList.add('modal-open');
  }

  openForResult(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.open();
      this._resultSubscription = this.result.subscribe((value) => {
        this.close();
        resolve(value);
      });
      this._cancelSubscription = this.cancel.subscribe(() => {
        this.close();
        reject();
      });
    });
  }

  close(): void {
    this._isOpen = false;
    document.body.classList.remove('modal-open');
    if (this._resultSubscription) {
      this._resultSubscription.unsubscribe();
      this._resultSubscription = null;
    }
    if (this._cancelSubscription) {
      this._cancelSubscription.unsubscribe();
      this._cancelSubscription = null;
    }
  }

  handleCLoseModal() {
    this._modalService.close(this.id);
  }

  handleCancel() {
    this.cancel.emit();
  }

  handleConfirm() {
    this.confirm.emit();
  }

  get isOpen(): boolean {
    return this._isOpen;
  }
}
