import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QEndpointComponent } from './query/q-endpoint/q-endpoint.component';
import { QNameComponent } from './query/q-name/q-name.component';
import { QContentComponent } from './query/q-content/q-content.component';
import { QDescriptionComponent } from './query/q-description/q-description.component';
import { QParamsComponent } from './query/q-params/q-params.component';
import { BrowseComponent } from './browse/browse.component';
import { EditComponent } from './edit/edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LocalStorageModule } from 'angular-2-local-storage';
import { QEntryComponent } from './browse/q-entry/q-entry.component';
import { EditableValueComponent } from './editable-value/editable-value.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    QEndpointComponent, QNameComponent, QContentComponent, QDescriptionComponent, QParamsComponent,
    BrowseComponent,
    EditComponent,
    PageNotFoundComponent,
    QEntryComponent,
    EditableValueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LocalStorageModule.withConfig({
      prefix: 'unknown',
      storageType: 'localStorage'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
