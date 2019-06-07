import { NgModule } from '@angular/core';

import { ShareModule } from '../share/share.module';

import { ResultViewerComponent } from './result-viewer.component';
import { ResultViewerRoutingModule } from './result-viewer-routing.module';

@NgModule({
  declarations: [
    ResultViewerComponent
  ],
  imports: [
    ShareModule,
    ResultViewerRoutingModule
  ]
})
export class ResultViewerModule {

}
