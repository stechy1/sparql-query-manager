import { NgModule } from '@angular/core';

import { BrowseResultsRoutingModule } from './browse-results-routing.module';
import { ShareModule } from '../share/share.module';

import { BrowseResultsComponent } from './browse-results.component';
import { REntryComponent } from './r-entry/r-entry.component';
import { RStatePipe } from './r-entry/r-state.pipe';
import { RTripleTypePipe } from './r-entry/r-triple-type.pipe';

@NgModule({
  declarations: [
    BrowseResultsComponent,
    REntryComponent,
    RStatePipe,
    RTripleTypePipe
  ],
  imports: [
    BrowseResultsRoutingModule,
    ShareModule
  ]
})
export class BrowseResultsModule {

}
