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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NewQueryComponent } from './new-query/new-query.component';
import { QTagsComponent } from './query/q-tags/q-tags.component';
import { QGroupComponent } from './browse/q-group/q-group.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NavbarDirective } from './navigation/navbar.directive';
import { SidebarDirective } from './navigation/sidebar.directive';
import { BrowseToolbarComponent } from './browse/browse-toolbar/browse-toolbar.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { QResultComponent } from './query/q-result/q-result.component';
import { BeautifyPipe } from './query/beautify.pipe';
import { LastResultComponent } from './last-result/last-result.component';

@NgModule({
  declarations: [
    AppComponent,
    QEndpointComponent, QNameComponent, QContentComponent, QDescriptionComponent, QParamsComponent,
    BrowseComponent,
    EditComponent,
    PageNotFoundComponent,
    QEntryComponent,
    EditableValueComponent,
    QTagsComponent,
    QGroupComponent,
    NavigationComponent,
    NavbarDirective,
    SidebarDirective,
    BrowseToolbarComponent,
    QResultComponent,
    BeautifyPipe,
    LastResultComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LocalStorageModule.withConfig({
      prefix: 'unknown',
      storageType: 'localStorage'
    }),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [BrowseToolbarComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
