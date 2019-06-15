import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl} from '@angular/forms';

@Component({
  selector: 'app-editable-value',
  templateUrl: './editable-value.component.html',
  styleUrls: ['./editable-value.component.css']
})
export class EditableValueComponent implements OnInit {

  // Vstupní parametr, pomocí kterého určím, zda-li mám zobrazit text area, nebo standartní input
  @Input() useTextarea: boolean;
  // Událost, která se zavolá vždy, když se změní hodnota
  @Output() valueChanged = new EventEmitter<string|number>();

  // Příznak, zda-li je komponenta v editačním modu, či nikoliv
  isEditing: boolean;
  // Příznak, zda-li se myš nachází nad komponentou
  hover: boolean;
  // Formulářový prvek pro editaci hodnoty
  inputElement = new FormControl('');

  // Aktuální hodnota
  private _value: string|number;
  // Originální hodnota
  private _original: string|number;

  constructor() { }

  ngOnInit() {}

  /**
   * Událost se zavolá pokaždé, když se stiskne klávesa
   *
   * @param event Událost
   */
  onKeyDown(event: KeyboardEvent) {
    // Pokud jsem zmáčkl 'escape'
    if (event.key === 'Escape') {
      // Změním zpátky aktuální hodnotu na hodnotu originálu
      this._value = this._original;
      // Vrátím se zpět do čtecího modu
      this.isEditing = false;
      return;
    }

    // Pokud jsem zmáčkl 'enter'
    if (event.key === 'Enter') {
      // Postarám se o uložení nové hodnoty
      this.handleClick();
    }
  }

  handleClick() {
    // Pokud je aktuální hodnota jiná, než originální
    if (this._value !== this._original) {
      // Uložím novou originální hodnotu jako aktuální
      this._original = this._value;
      // Informuji svého posluchače, že se změnila hodnota
      this.valueChanged.emit(this._value);
    }
    // Vrátím se zpět do čtecího režimu
    this.isEditing = false;
  }

  /**
   * Reakce na odejetí myši z komponenty
   */
  handleMouseLeave() {
    if (this._value !== '') {
      this.hover = false;
    }
  }

  get value(): string | number {
    return this._value;
  }

  @Input()
  set value(value: string | number) {
    this._value = value;
    this._original = this._original === undefined ? this._value : this._original;
    this.hover = this._value === '';
  }
}
