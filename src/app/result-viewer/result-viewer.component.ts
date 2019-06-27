import { Component, OnInit } from '@angular/core';
import { EndpointCommunicatorService } from '../share/endpoint-communicator.service';
import { copyToClipboard } from '../content-to-clipboard';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryResultService } from '../query-result/query-result.service';
import { ToastrService } from 'ngx-toastr';
import { QueryResult } from '../query-result/query-result';
import { Location } from '@angular/common';

@Component({
  selector: 'app-result-viewer',
  templateUrl: './result-viewer.component.html',
  styleUrls: ['./result-viewer.component.css']
})
export class ResultViewerComponent implements OnInit {

  // Reference na výsledek dotazu
  queryResult: QueryResult;
  // Titulek obsahující název dotazu
  title: string;
  // Přepínač mezi tělem dotazu a výsledkem dotazu
  showResult: boolean;

  constructor(private _endpointCommunicator: EndpointCommunicatorService, private _qrservice: QueryResultService,
              private _route: ActivatedRoute, private _router: Router,
              private _location: Location,
              private _toaster: ToastrService) { }

  /**
   * Načte výsledek dotazu podle ID
   *
   * @param id ID dotazu
   */
  private _loadQueryResult(id: string) {
    // Pokud je ID hodnota 'last'
    if (id === 'last') {
      // Přečtu si hodnotu posledního výsledku dotazu
      this.queryResult = <QueryResult>this._endpointCommunicator.lastQueryResult;
      // Pokud není žádny poslední dotaz uložený
      if (this.queryResult === undefined) {
        // Přesměruji zpátky na prohlížeč výsledků dotazu
        this._router.navigate(['browse-results']);
      }
      // Nastavím titulek
      this.title = `Výsledek posledního dotazu: ${this.queryResult.name}`;
    } else {
      // Najdu výsledek dotazu podle ID
      this.queryResult = this._qrservice.byId(id);
      // Nastavím titulek
      this.title = `Výsledek dotazu: ${this.queryResult.name}`;
    }
  }

  ngOnInit() {
    // Získám ID dotazu
    const resultId = this._route.snapshot.params['id'];
    // Pokud není v navigaci uložena hodnota 'tab'
    if (!this._route.snapshot.queryParams['tab']) {
      // Přesměruji na stejnou stránku, pouze přidám do parametrů hodnotu pro tab
      // this._router.navigate(['result-viewer', resultId], {queryParams: {tab: 'source'}});
      this._location.replaceState(`result-viewer/${resultId}`, 'tab=source');
      return;
    }
    // Postarám se o načtení dotazu
    this._loadQueryResult(resultId);
    // Přihlásím se k odběru změn parametrů v navigaci
    this._route.params.subscribe(value => {
      // Vždy, když se změní ID, načtu nový výsledek dotazu
      this._loadQueryResult(value['id']);
    });
    // Nastavím přepínač mezi tělem dotazu a výsledkem dotazu
    this.showResult = this._route.snapshot.queryParams['tab'] !== 'source';
  }

  /**
   * Reakce na tlačítko pro zkopírování dotazu
   */
  handleCopyResult() {
    // Zavolám univerzální funkci pro zkopírování dotazu do schránky uživatele
    copyToClipboard(this.queryResult);
    // Informuji uživatele, o úspěchu
    this._toaster.success('Výsledek dotazu byl zkopírován');
  }
}
