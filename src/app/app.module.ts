import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ILocalStorageServiceConfig, LocalStorageModule } from 'angular-2-local-storage';

import { AppRoutingModule } from './app-routing.module';
import { BrowseQueryModule } from './browse-query/browse-query.module';
import { BrowseResultsModule } from './browse-results/browse-results.module';
import { EditQueryModule } from './edit-query/edit-query.module';
import { NavigationModule } from './navigation/navigation.module';
import { ResultViewerModule } from './result-viewer/result-viewer.module';
import { SettingsModule } from './settings/settings.module';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { PageNotFoundModule } from './page-not-found/page-not-found.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LocalStorageModule.withConfig(<ILocalStorageServiceConfig>environment.localStorage),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    // ------ Application Modules -------
    BrowseQueryModule,
    BrowseResultsModule,
    EditQueryModule,
    NavigationModule,
    ResultViewerModule,
    SettingsModule,
    PageNotFoundModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
