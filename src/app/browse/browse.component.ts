import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryService } from '../query/query.service';
import { Query } from '../query/query';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

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

  constructor(private _qservice: QueryService) { }

  private _import(input: HTMLInputElement, override: boolean) {
    const reader = new FileReader();
    const self = this;
    reader.onload = () => {
      const text = <string> reader.result;
      self._qservice.import(text, override);
    };
    reader.readAsText(input.files[0]);
  }

  ngOnInit() {
    this._queries = this._qservice.allQueries();
    this.formGroupBy = new FormGroup({
      groupBy: new FormControl('none')
    });
  }

  get queries() {
    return this._queries;
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
