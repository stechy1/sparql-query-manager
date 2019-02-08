import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Query } from '../query';

@Component({
  selector: 'app-q-content',
  templateUrl: './q-content.component.html',
  styleUrls: ['./q-content.component.css']
})
export class QContentComponent implements OnInit {

  @ViewChild('query_content')
  private _textArea: ElementRef;
  private _query: Query;
  private _content: string;
  loading: boolean;
  @Output() dataChanged = new EventEmitter<Query>();
  @Output() updateContentOnly = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.loading = true;
  }

  @Input()
  set query(value: Query) {
    this._query = value;
    this._content = this._query.content;
    this.loading = true;
    setTimeout(() => {
      const natElement = <HTMLTextAreaElement> this._textArea.nativeElement;
      natElement.style.height = '1px';
      const scrollHeight = natElement.scrollHeight;
      natElement.style.height = ((25 + scrollHeight) + 'px');
      natElement.disabled = false;
      this.loading = false;
    }, 500);
  }

  get content() {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  handleUpdateContent() {
    if (this._query.content === this.content) {
      return;
    }

    this.updateContentOnly.emit(this.content);
  }

  handleSaveContent() {
    if (this._query.content === this.content) {
      return;
    }

    this._query.content = this.content;
    this.dataChanged.emit(this._query);
  }
}
