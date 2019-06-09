import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { ModalService } from './modal.service';
import { animation } from './modal.animation';

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
  @Output() cancel = new EventEmitter<any>();
  @Output() confirm = new EventEmitter<any>();

  private readonly element: any;
  private _isOpen = false;

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

  close(): void {
    this._isOpen = false;
    document.body.classList.remove('modal-open');
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
