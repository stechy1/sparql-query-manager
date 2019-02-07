import { Component, OnInit} from '@angular/core';
import { QueryService } from '../query/query.service';
import { Query } from '../query/query';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

  private _queries: Query[];
  formGroupBy: FormGroup;
  formOrderBy: FormGroup;
  formOrderType: FormGroup;
  searchedValue: string;

  constructor(private _qservice: QueryService, private _route: ActivatedRoute, private _router: Router) { }

  private _import(input: HTMLInputElement, override: boolean) {
    const reader = new FileReader();
    const self = this;
    reader.onload = () => {
      const text = <string> reader.result;
      self._qservice.import(text, override);
    };
    reader.readAsText(input.files[0]);
  }

  private _handleOrderBy(orderBy: string, orderType: string) {
    this._queries.sort((a, b) => a.name.localeCompare(b.name));
    switch (orderBy) {
      case 'last_run':
        this._queries.sort((a, b) => a.lastRun - b.lastRun);
        break;
      case 'date_of_creation':
        this._queries.sort((a, b) => a.created - b.created);
        break;
      case 'count_of_run':
        this._queries.sort((a, b) => a.runCount - b.runCount);
        break;
    }
    if (orderType === 'descending') {
      this._queries.reverse();
    }
  }

  ngOnInit() {
    this._queries = this._qservice.allQueries();
    this.formGroupBy = new FormGroup({
      groupBy: new FormControl('none')
    });
    this.formOrderBy = new FormGroup({
      orderBy: new FormControl('alphabeticaly')
    });
    this.formOrderType = new FormGroup({
      orderType: new FormControl('ascending')
    });
    this._route.params.subscribe(params => {
      const groupBy = params['groupBy'] || 'none';
      const orderBy = params['orderBy'] || 'alphabeticaly';
      const orderType = params['orderType'] || 'ascending';
      this.formGroupBy.setValue({'groupBy': groupBy});
      this.formOrderBy.setValue({'orderBy': orderBy});
      this.formOrderType.setValue({'orderType': orderType});

      this._handleOrderBy(orderBy, orderType);
    });

    this.formGroupBy.valueChanges.subscribe(change => {
      const groupBy = change['groupBy'];
      const orderBy = this._route.snapshot.params['orderBy'] || 'alphabeticaly';
      const orderType = this._route.snapshot.params['orderType'] || 'ascending';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
    this.formOrderBy.valueChanges.subscribe(change => {
      const orderBy = change['orderBy'];
      const groupBy = this._route.snapshot.params['groupBy'] || 'none';
      const orderType = this._route.snapshot.params['orderType'] || 'ascending';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
    this.formOrderType.valueChanges.subscribe(change => {
      const orderType = change['orderType'];
      const orderBy = this._route.snapshot.params['orderBy'] || 'alphabeticaly';
      const groupBy = this._route.snapshot.params['groupBy'] || 'none';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
  }

  handleDeleteRequest(query: Query) {
    this._qservice.delete(query.id);
  }

  handleExport() {
    const a = document.createElement('a');
    const file = new Blob([this._qservice.export(this._queries.filter(value => value.selected))], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = prompt('Zadejte název souboru...', 'queries.json');
    a.click();
  }

  handleImportOverride(event: Event) {
    this._import(<HTMLInputElement> event.target, true);
  }

  handleImportAppend(event: Event) {
    this._import(<HTMLInputElement> event.target, false);
  }

  handleSelectAll() {
    this._queries.forEach(query => query.selected = true);
  }

  handleSelectNone() {
    this._queries.forEach(query => query.selected = false);
  }

  handleDeleteAll() {
    if (confirm('Opravdu si přejete smazat celou databázi?')) {
      this._qservice.clear();
    }
  }

  filterByEndpoint(query: Query, endpoint: string): boolean {
    return query.endpoint === endpoint;
  }

  filterByTag(query: Query, tag: string): boolean {
    return query.tags.indexOf(tag) !== -1;
  }

  get queries() {
    return this._queries;
  }

  get endpoints(): string[] {
    return this._qservice.endpoints;
  }

  get tags(): string[] {
    return this._qservice.tags;
  }

  get selectedQueries(): number {
    return this._queries.filter(value => value.selected).length;
  }
}
