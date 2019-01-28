import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Query } from '../query/query';
import { QueryService } from '../query/query.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-query',
  templateUrl: './new-query.component.html',
  styleUrls: ['./new-query.component.css']
})
export class NewQueryComponent implements OnInit {

  nameFormGroup: FormGroup;
  informationFormGroup: FormGroup;
  tagsFormGroup: FormGroup;
  queryFormGroup: FormGroup;
  variablesFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _queryService: QueryService, private _router: Router) { }

  ngOnInit() {
    this.nameFormGroup = this._formBuilder.group({
      queryName: ['', Validators.required]
    });
    this.informationFormGroup = this._formBuilder.group({
      queryEndpoint: ['', Validators.required],
      queryDescription: [''],
    });
    this.tagsFormGroup = this._formBuilder.group({
      queryTags: []
    });
    this.queryFormGroup = this._formBuilder.group({
      queryContent: ['', Validators.required]
    });
    this.variablesFormGroup = this._formBuilder.group({
      queryVariables: []
    });
  }

  handleNewQuery() {
    const name = this.nameFormGroup.value['queryName'];
    const endpoint = this.informationFormGroup.value['queryEndpoint'];
    const description = this.informationFormGroup.value['queryDescription'];
    // const tags = this.tagsFormGroup.value['tags'];
    const tags = [];
    const content = this.queryFormGroup.value['queryContent'];
    // const variables = this.variablesFormGroup.value['variables'];
    const variables = {};

    this._queryService.create(name, endpoint, description, tags, content, variables);

    this._router.navigate(['/browse']);
  }
}
