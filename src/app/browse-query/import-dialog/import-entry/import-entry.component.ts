import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ImportEntry } from '../../../query/import-entry';
import { ImportStrategy } from '../../../query/import-strategy';

@Component({
  selector: 'app-import-entry',
  templateUrl: './import-entry.component.html',
  styleUrls: ['./import-entry.component.css']
})
export class ImportEntryComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() entry: ImportEntry;

  private _subscription: Subscription;

  form: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.form = this._fb.group({
      importStrategy: new FormControl(ImportStrategy.KEY)
    });
    this._subscription = this.form.valueChanges.subscribe(change => {
      this.entry.importStrategy = change[ImportStrategy.KEY];
    });
  }

  ngAfterViewInit(): void {
    const values = {};
    values[ImportStrategy.KEY] = ImportStrategy.OVERRIDE_LOCAL.value;
    this.form.setValue(values);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  get importStrategies(): ImportStrategy[] {
    return ImportStrategy.VALUES;
  }
}
