import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditableValueComponent } from './editable-value/editable-value.component';
import { TimePipe } from './time.pipe';

@NgModule({
  declarations: [
    EditableValueComponent,
    TimePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditableValueComponent,
    TimePipe
  ]
})
export class ShareModule {

}
