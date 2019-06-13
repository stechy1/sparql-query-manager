import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditableValueComponent } from './editable-value/editable-value.component';
import { TimePipe } from './time.pipe';
import { ModalComponent } from './modal/modal.component';
import { ConfirmDialogComponent } from './modal/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    EditableValueComponent,
    ModalComponent,
    TimePipe,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditableValueComponent,
    ModalComponent,
    TimePipe,
    ConfirmDialogComponent
  ]
})
export class ShareModule {

}
