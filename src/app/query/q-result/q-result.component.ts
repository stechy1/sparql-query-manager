import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as beautify from 'js-beautify';

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
    // Vytvoření provizorního elementu 'textarea'
    const el = document.createElement('textarea');
    // Nastavení hodnoty
    el.value = beautify(JSON.stringify(this.result));
    // Připnutí elementu do dokumentu
    document.body.appendChild(el);
    // Vybrání celého obsahu v elementu
    el.select();
    // Zkopírování obsahu do schránky
    document.execCommand('copy');
    // Odstranění elementu z dokumentu
    document.body.removeChild(el);
  }

  handleShowSeparate() {
    // TODO uložit výsledek do paměti a přesměrovat na prohlížeč posledního dotazu
  }
}
