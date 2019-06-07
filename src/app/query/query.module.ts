import { NgModule } from '@angular/core';

import { ShareModule } from '../share/share.module';

import { QEndpointComponent } from './q-endpoint/q-endpoint.component';
import { QNameComponent } from './q-name/q-name.component';
import { QContentComponent } from './q-content/q-content.component';
import { QDescriptionComponent } from './q-description/q-description.component';
import { QParamsComponent } from './q-params/q-params.component';
import { QTagsComponent } from './q-tags/q-tags.component';
import { QResultComponent } from './q-result/q-result.component';
import { BeautifyPipe } from './beautify.pipe';
import { QActionsComponent } from './q-actions/q-actions.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    QActionsComponent,
    QEndpointComponent,
    QNameComponent,
    QContentComponent,
    QDescriptionComponent,
    QParamsComponent,
    QTagsComponent,
    QResultComponent,
    BeautifyPipe
  ],
  imports: [
    ShareModule,
    RouterModule
  ],
  exports: [
    QActionsComponent,
    QEndpointComponent,
    QNameComponent,
    QContentComponent,
    QDescriptionComponent,
    QParamsComponent,
    QTagsComponent,
    QResultComponent
  ]
})
export class QueryModule {

}
