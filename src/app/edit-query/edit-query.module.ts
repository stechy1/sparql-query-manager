import { NgModule } from '@angular/core';

import { ShareModule } from '../share/share.module';

import { EditQueryComponent } from './edit-query.component';
import { QueryModule } from '../query/query.module';
import { EditQueryRoutingModule } from './edit-query-routing.module';

@NgModule({
  declarations: [
    EditQueryComponent
  ],
  imports: [
    ShareModule,
    EditQueryRoutingModule,
    QueryModule
  ]
})
export class EditQueryModule {

}
