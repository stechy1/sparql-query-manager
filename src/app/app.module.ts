import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QEndpointComponent } from './query/q-endpoint/q-endpoint.component';
import { QNameComponent } from './query/q-name/q-name.component';
import { QContentComponent } from './query/q-content/q-content.component';
import { QDescriptionComponent } from './query/q-description/q-description.component';
import { QParamsComponent } from './query/q-params/q-params.component';
import { BrowseQueryComponent } from './browse-query/browse-query.component';
import { EditComponent } from './edit/edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LocalStorageModule } from 'angular-2-local-storage';
import { QEntryComponent } from './browse-query/q-entry/q-entry.component';
import { EditableValueComponent } from './editable-value/editable-value.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QTagsComponent } from './query/q-tags/q-tags.component';
import { QGroupComponent } from './browse-query/q-group/q-group.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NavbarDirective } from './navigation/navbar.directive';
import { SidebarDirective } from './navigation/sidebar.directive';
import { BrowseToolbarComponent } from './browse-query/browse-toolbar/browse-toolbar.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { QResultComponent } from './query/q-result/q-result.component';
import { BeautifyPipe } from './query/beautify.pipe';
import { BrowseResultsComponent } from './browse-results/browse-results.component';
import { QrEntryComponent } from './browse-results/qr-entry/qr-entry.component';
import { QrStatePipe } from './browse-results/qr-entry/qr-state.pipe';
import { TimePipe } from './time.pipe';
import { ResultViewerComponent } from './result-viewer/result-viewer.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    BrowseQueryComponent,
    NavigationComponent,
    BrowseToolbarComponent,
    BrowseResultsComponent,
    ResultViewerComponent,
    QEndpointComponent, QNameComponent, QContentComponent, QDescriptionComponent,
    QParamsComponent, QEntryComponent, QTagsComponent, QGroupComponent, QResultComponent,
    QrEntryComponent,
    EditComponent,
    EditableValueComponent,
    NavbarDirective,
    SidebarDirective,
    BeautifyPipe,
    QrStatePipe,
    TimePipe,
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
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ToastrModule.forRoot()
  ],
  entryComponents: [BrowseToolbarComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
