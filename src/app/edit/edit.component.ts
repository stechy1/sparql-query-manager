import { Component, OnInit } from '@angular/core';
import { QueryService } from '../query/query.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Query } from '../query/query';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  private _query: Query;

  constructor(private _route: ActivatedRoute, private _qservice: QueryService, private _location: Location) { }

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this._query = this._qservice.byId(id);
  }

  get query(): Query {
    return this._query;
  }
}
