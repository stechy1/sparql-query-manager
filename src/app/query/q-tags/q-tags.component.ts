import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-q-tags',
  templateUrl: './q-tags.component.html',
  styleUrls: ['./q-tags.component.css']
})
export class QTagsComponent implements OnInit {

  private _tags: string[];

  @Output() dataChanged = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit() {
  }

  remove(tag: string): void {
    const index = this._tags.indexOf(tag);

    if (index >= 0) {
      this._tags.splice(index, 1);
      this.dataChanged.emit(this.tags);
    }
  }

  handleTagKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const srcElement = (<HTMLInputElement> event.srcElement);
      this._tags.push(srcElement.value);
      srcElement.value = '';
      this.dataChanged.emit(this.tags);
    }
  }

  @Input()
  set tags(value: string[]) {
    this._tags = value;
  }

  get tags(): string[] {
    return this._tags;
  }
}
