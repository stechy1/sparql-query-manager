import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
  loading: boolean;

  constructor() { }

  ngOnInit() {
    this.loading = true;
  }

  @Input()
  set query(value: Query) {
    this._query = value;
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
    return this._query.content;
  }

  set content(value: string) {
    this._query.content = value;
  }
}
