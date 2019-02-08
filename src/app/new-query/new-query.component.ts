import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Query } from '../query/query';
import { QueryService } from '../query/query.service';
import { Router } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { QParamsComponent } from '../query/q-params/q-params.component';

@Component({
  selector: 'app-new-query',
  templateUrl: './new-query.component.html',
  styleUrls: ['./new-query.component.css']
})
export class NewQueryComponent implements OnInit {

  nameFormGroup: FormGroup;
  informationFormGroup: FormGroup;
  tags: string[];
  variables: {};
  queryFormGroup: FormGroup;

  @ViewChild(QParamsComponent) private _paramsComponent: QParamsComponent;

  constructor(private _formBuilder: FormBuilder, private _queryService: QueryService, private _router: Router) {
    this.tags = [];
    this.variables = {};
  }

  ngOnInit() {
    this.nameFormGroup = this._formBuilder.group({
      queryName: ['', Validators.required]
    });
    this.informationFormGroup = this._formBuilder.group({
      queryEndpoint: ['', Validators.required],
      queryDescription: [''],
    });
    this.queryFormGroup = this._formBuilder.group({
      queryContent: ['', Validators.required]
    });
  }

  handleNewQuery() {
    const name = this.nameFormGroup.value['queryName'];
    const endpoint = this.informationFormGroup.value['queryEndpoint'];
    const description = this.informationFormGroup.value['queryDescription'];
    const content = this.queryFormGroup.value['queryContent'];

    this._queryService.create(name, endpoint, description, this.tags, content, this.variables);

    this._router.navigate(['/browse']);
  }

  get content(): string {
    return this.queryFormGroup.value['queryContent'];
  }

  handleStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 4) {
      this._paramsComponent.content = this.content;
      this._paramsComponent.params = {};
      this._paramsComponent.findVariables();
    }
  }
}
