import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { copyToClipboard } from '../../content-to-clipboard';

@Component({
  selector: 'app-q-result',
  templateUrl: './q-result.component.html',
  styleUrls: ['./q-result.component.css']
})
export class QResultComponent implements OnInit, AfterViewInit {

  @Input() result: string;
  windowHeight: number;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.windowHeight = window.innerHeight - 200;
  }

  handleCopyResult() {
    copyToClipboard(this.result);
  }

  handleShowSeparate() {
    // TODO uložit výsledek do paměti a přesměrovat na prohlížeč posledního dotazu
  }
}
