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
    setTimeout(() => this.windowHeight = window.innerHeight - 200, 500);
    console.log("Obsah: " + this.result + " konec");
  }

  handleCopyResult() {
    copyToClipboard(this.result);
  }
}
