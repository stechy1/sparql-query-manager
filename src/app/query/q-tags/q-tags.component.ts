import { Component, Input, OnInit } from '@angular/core';
import { Query } from '../query';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-q-tags',
  templateUrl: './q-tags.component.html',
  styleUrls: ['./q-tags.component.css']
})
export class QTagsComponent implements OnInit {

  private _query: Query;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() { }

  ngOnInit() {
  }

  @Input()
  set query(value: Query) {
    this._query = value;
  }

  get tags() {
    return this._query.tags;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this._query.addTag(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    this._query.removeTag(tag);
  }

}
