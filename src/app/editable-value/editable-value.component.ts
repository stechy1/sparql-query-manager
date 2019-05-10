import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl} from '@angular/forms';

@Component({
  selector: 'app-editable-value',
  templateUrl: './editable-value.component.html',
  styleUrls: ['./editable-value.component.css']
})
export class EditableValueComponent implements OnInit {

  private _value: string|number;
  private _original: string|number;
  @Input() useTextarea: boolean;
  isEditing: boolean;
  @Output() valueChanged = new EventEmitter<string|number>();
  hover: boolean;
  inputElement = new FormControl('');

  constructor() { }

  ngOnInit() {}

  get value(): string | number {
    return this._value;
  }

  @Input()
  set value(value: string | number) {
    this._value = value;
    this._original = this._original === undefined ? this._value : this._original;
    this.hover = this._value === '';
  }

  handleClick() {
    if (this._value !== this._original) {
      this._original = this._value;
      this.valueChanged.emit(this._value);
    }
    this.isEditing = false;
  }

  onKeyDown(event: any) {
    if (event.key === 'Escape') {
      this._value = this._original;
      this.isEditing = false;
      return;
    }

    if (event.key === 'Enter') {
      this.handleClick();
    }
  }

  handleMouseLeave() {
    if (this._value !== '') {
      this.hover = false;
    }
  }
}
