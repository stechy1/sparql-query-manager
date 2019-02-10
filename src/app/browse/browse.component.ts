import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QueryService } from '../query/query.service';
import { Query } from '../query/query';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as Fuse from 'fuse.js';
import { FuseOptions } from 'fuse.js';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit, AfterViewInit {

  private _fusejs: Fuse<Query, FuseOptions<Query>>;
  queries: Query[];
  fuseQueries: Query[] = [];
  formGroupBy: FormGroup;
  formOrderBy: FormGroup;
  formOrderType: FormGroup;
  searchedValue: string;
  @ViewChild('inputSearch') inputSearch: ElementRef;

  constructor(private _qservice: QueryService,
              private _route: ActivatedRoute, private _router: Router) { }

  private _import(input: HTMLInputElement, override: boolean): Promise<Query[]> {
    const reader = new FileReader();
    const self = this;
    return new Promise<Query[]>((resolve) => {
      reader.onload = () => {
        const text = <string> reader.result;
        self._qservice.import(text, override);
        resolve(self._qservice.allQueries());
      };
      reader.readAsText(input.files[0]);
    });
  }

  private _handleOrderBy(orderBy: string, orderType: string) {
    this.fuseQueries.sort((a, b) => a.name.localeCompare(b.name));
    switch (orderBy) {
      case 'last_run':
        this.fuseQueries.sort((a, b) => a.lastRun - b.lastRun);
        break;
      case 'date_of_creation':
        this.fuseQueries.sort((a, b) => a.created - b.created);
        break;
      case 'count_of_run':
        this.fuseQueries.sort((a, b) => a.runCount - b.runCount);
        break;
    }
    if (orderType === 'descending') {
      this.fuseQueries.reverse();
    }
  }

  ngOnInit() {
    this.queries = this._qservice.allQueries();
    this._fusejs = new Fuse(this.queries, {keys: ['name', 'tags']});
    this.fuseQueries = [...this.queries];
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

  ngAfterViewInit(): void {
    (<HTMLInputElement>this.inputSearch.nativeElement).onkeyup = ev => {
      this.searchedValue = (<HTMLInputElement>ev.target).value;
      if (this.searchedValue === '') {
        this.fuseQueries.splice(0);
        for (const query of this.queries) {
          this.fuseQueries.push(query);
        }
        return;
      }
      this._fusejs.setCollection(this.queries);
      const fuseQueries = this._fusejs.search(this.searchedValue);
      this.fuseQueries.splice(0);
      for (const query of fuseQueries) {
        this.fuseQueries.push(query);
      }
    };
  }

  handleDeleteRequest(query: Query) {
    this._qservice
    .delete(query.id)
    .then(() => {
      const index = this.fuseQueries.indexOf(query);
      this.fuseQueries.splice(index, 1);
    });
  }

  handleExport() {
    const a = document.createElement('a');
    const file = new Blob([this._qservice.export(this.queries.filter(value => value.selected))], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = prompt('Zadejte název souboru...', 'queries.json');
    a.click();
  }

  handleImportOverride(event: Event) {
    this._import(<HTMLInputElement> event.target, true)
    .then(queries => {
      this.fuseQueries.splice(0);
      for (const query of queries) {
        this.fuseQueries.push(query);
      }
    });
  }

  handleImportAppend(event: Event) {
    this._import(<HTMLInputElement> event.target, false)
    .then(queries => {
      for (const query of queries) {
        this.fuseQueries.push(query);
      }
    });
  }

  handleSelectAll() {
    this.queries.forEach(query => query.selected = true);
  }

  handleSelectNone() {
    this.queries.forEach(query => query.selected = false);
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

  get endpoints(): string[] {
    return this._qservice.endpoints;
  }

  get tags(): string[] {
    return this._qservice.tags;
  }

  get selectedQueries(): number {
    return this.queries.filter(value => value.selected).length;
  }
}
