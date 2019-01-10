import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-editable-value',
  templateUrl: './editable-value.component.html',
  styleUrls: ['./editable-value.component.css']
})
export class EditableValueComponent implements OnInit {

  private _value: string|number;
  @Input() useTextarea: boolean;
  isEditing: boolean;
  @Output() valueChanged = new EventEmitter<string|number>();

  constructor() { }

  ngOnInit() {
    this.isEditing = false;
    this.useTextarea = false;
  }

  get value(): string | number {
    return this._value;
  }

  @Input()
  set value(value: string | number) {
    this._value = value;
  }

  handleClick() {
    this.valueChanged.emit(this._value);
    this.isEditing = false;
  }

  onKeyDown(event: any) {
    if (event.key === 'Enter') {
      this.handleClick();
    }
  }
}
