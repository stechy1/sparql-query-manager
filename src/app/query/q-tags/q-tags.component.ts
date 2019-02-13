import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-q-tags',
  templateUrl: './q-tags.component.html',
  styleUrls: ['./q-tags.component.css']
})
export class QTagsComponent implements OnInit {

  private _tags: string[];

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Output() dataChanged = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit() {
  }

  @Input()
  set tags(value: string[]) {
    this._tags = value;
  }

  get tags(): string[] {
    return this._tags;
  }

  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;
  //
  //   if ((value || '').trim()) {
  //     this.tags.push(value.trim());
  //     this.dataChanged.emit(this.tags);
  //   }
  //
  //   if (input) {
  //     input.value = '';
  //   }
  // }

  remove(tag: string): void {
    const index = this._tags.indexOf(tag);

    if (index >= 0) {
      this._tags.splice(index, 1);
      this.dataChanged.emit(this.tags);
    }
  }

}
