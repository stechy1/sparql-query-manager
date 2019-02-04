import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryService } from '../query/query.service';
import { Query } from '../query/query';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { groupBy } from 'rxjs/operators';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

  private _queries: Query[];
  @ViewChild('querySelectionList') private _queryList: MatSelectionList;
  selectedQueries: string[] = [];
  formGroupBy: FormGroup;
  formOrderBy: FormGroup;
  formOrderType: FormGroup;

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
      case 'alphabeticaly':
        this._queries.sort((a, b) => a.name.localeCompare(b.name));
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

  handleDeleteRequest(id: string) {
    this._qservice.delete(id);
  }

  handleExport() {
    const a = document.createElement('a');
    const file = new Blob([this._qservice.export(this.selectedQueries)], {type: 'text/plain'});
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
    this._queryList.selectAll();
    this.selectedQueries.splice(0, this.selectedQueries.length);
    this._queries.forEach(query => this.selectedQueries.push(query.id));
  }

  handleSelectNone() {
    this._queryList.deselectAll();
    this.selectedQueries.splice(0, this.selectedQueries.length);
  }

  handleQuerySelectionChange(event: MatSelectionListChange) {
    console.log(event);
    const queryId = event.option.value;
    const selected = event.option.selected;
    if (selected) {
      this.selectedQueries.push(queryId);
    } else {
      this.selectedQueries.splice(this.selectedQueries.indexOf(queryId), 1);
    }
  }

  handleDeleteAll() {
    if (confirm('Opravdu si přejete smazat celou databázi?')) {
      this._qservice.clear();
    }
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

  getQueriesByEndpoint(endpoint: string): Query[] {
    return this._queries.filter(query => query.endpoint === endpoint);
  }

  getQueriesByTag(tag: string): Query[] {
    return this._queries.filter(query => query.tags.indexOf(tag) !== -1);
  }
}
