import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditableValueComponent } from './editable-value/editable-value.component';
import { DurationPipe } from './duration.pipe';
import { ModalComponent } from './modal/modal.component';
import { ConfirmDialogComponent } from './modal/confirm-dialog/confirm-dialog.component';
import { TimePipe } from './time.pipe';
import { DatePipe } from './date.pipe';
import { DateTimePipe } from './date-time.pipe';

@NgModule({
  declarations: [
    EditableValueComponent,
    ModalComponent,
    DurationPipe,
    ConfirmDialogComponent,
    TimePipe,
    DatePipe,
    DateTimePipe
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
    DurationPipe,
    ConfirmDialogComponent,
    DateTimePipe
  ]
})
export class ShareModule {

}
