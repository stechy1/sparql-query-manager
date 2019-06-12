import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Query } from '../query';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-q-content',
  templateUrl: './q-content.component.html',
  styleUrls: ['./q-content.component.css']
})
export class QContentComponent implements OnInit {

  @ViewChild('query_content', { static: true })
  private _textArea: ElementRef;

  @Input() query: Observable<Query>;
  @Output() dataChanged = new EventEmitter<Query>();
  @Output() updateContentOnly = new EventEmitter<string>();

  loading: boolean;

  private _query: Query;
  private _content: string;

  constructor() { }

  private _recalculateTextAreaHeight() {
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

  ngOnInit() {
    this.loading = true;
    this.query.subscribe(value => {
      this._query = value;
      this._content = this._query.content;
      this._recalculateTextAreaHeight();
    });
  }

  handleUpdateContent() {
    if (this._query.content === this.content) {
      return;
    }

    this._recalculateTextAreaHeight();
    this.updateContentOnly.emit(this.content);
  }

  handleSaveContent() {
    if (this._query.content === this.content) {
      return;
    }

    this._query.content = this.content;
    this.dataChanged.emit(this._query);
  }

  get content() {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  get contentChanged(): boolean {
    return (this._query) ? this._query.content !== this._content : false;
  }
}
