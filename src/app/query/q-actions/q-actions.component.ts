import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Query } from '../query';
import { EndpointCommunicatorService, ResponceFormat } from '../../endpoint-communicator.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QueryService } from '../query.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-q-actions',
  templateUrl: './q-actions.component.html',
  styleUrls: ['./q-actions.component.css']
})
export class QActionsComponent implements OnInit {

  @Input() query: Observable<Query>;
  @Output() doQuery = new EventEmitter();

  ignoreStatistics: boolean;

  private _query: Query;
  private _responceFormats = Object.keys(ResponceFormat);

  constructor(private _endpointCommunicator: EndpointCommunicatorService, private _qservice: QueryService,
              private _toaster: ToastrService, private _router: Router) { }

  ngOnInit() {
    this.ignoreStatistics = false;
    this.query.subscribe(value => {
      this._query = value;
    });
  }

  /**
   * Reakce na tlačítko pro provedení dotazu
   */
  handleDoQuery() {
    this.doQuery.emit(this.ignoreStatistics);
  }

  handleDuplicate() {
    this._qservice.duplicate(this._query).then(newID => {
      this._toaster.info('Dotaz byl úspěšně zduplikován');
      this._router.navigate(['browse-query']).then(() => {
        setTimeout(() => {this._router.navigate(['edit', newID]); }, 500);
      });
    });
  }

  /**
   * Vrátí příznak, zda-li se aktuálně zpracovává dotaz, či nikoliv
   */
  get working(): boolean {
    return this._endpointCommunicator.working;
  }

  /**
   * Nastaví zkratku formátu odpovědi ze serveru
   *
   * @param responceFormat Zkratka formátu odpovědi ze serveru. Může být jeden ze čtyř podporovaných formátů z výčtu: {@link ResponceFormat}
   */
  set responceFormat(responceFormat: string) {
    this._endpointCommunicator.responceFormat = responceFormat;
  }

  /**
   * Vrátí zkratku formátu odpovědi ze serveru
   */
  get responceFormat(): string {
    return this._endpointCommunicator.responceFormat;
  }

  /**
   * Vrátí pole dostupných formátů odpovědí ze serveru
   */
  get responceFormats(): Array<string> {
    return this._responceFormats;
  }


}
