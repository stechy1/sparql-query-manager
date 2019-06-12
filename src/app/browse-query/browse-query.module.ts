import { NgModule } from '@angular/core';

import { BrowseQueryRoutingModule } from './browse-query-routing.module';
import { ShareModule } from '../share/share.module';

import { BrowseQueryComponent } from './browse-query.component';
import { BrowseToolbarComponent } from './browse-toolbar/browse-toolbar.component';
import { QEntryComponent } from './q-entry/q-entry.component';
import { QGroupComponent } from './q-group/q-group.component';
import { SearchComponent } from './search/search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { ImportEntryComponent } from './import-dialog/import-entry/import-entry.component';

@NgModule({
  declarations: [
    BrowseQueryComponent,
    BrowseToolbarComponent,
    QEntryComponent,
    QGroupComponent,
    SearchComponent,
    ImportDialogComponent,
    ImportEntryComponent
  ],
  imports: [
    BrowseQueryRoutingModule,
    BrowserAnimationsModule,
    ShareModule
  ],
  entryComponents: [
    BrowseToolbarComponent
  ]
})
export class BrowseQueryModule {

}
