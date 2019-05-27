import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { copyToClipboard } from '../../content-to-clipboard';
import { ToastrService } from 'ngx-toastr';
import { QueryResult } from '../../query-result/query-result';

@Component({
  selector: 'app-q-result',
  templateUrl: './q-result.component.html',
  styleUrls: ['./q-result.component.css']
})
export class QResultComponent implements OnInit, AfterViewInit {

  @Input() result: QueryResult;
  windowHeight: number;

  constructor(private _toaster: ToastrService) { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => this.windowHeight = window.innerHeight - 200, 500);
  }

  handleCopyResult() {
    copyToClipboard(this.result);
    this._toaster.success('Zpráva byla zkopírována');
  }

  handleCloseResponce() {
    this.result = undefined;
  }
}
