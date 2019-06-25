import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ILocalStorageServiceConfig, LocalStorageModule } from 'angular-2-local-storage';

import { AppRoutingModule } from './app-routing.module';
import { BrowseQueryModule } from './browse-query/browse-query.module';
import { NavigationModule } from './navigation/navigation.module';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { PageNotFoundModule } from './page-not-found/page-not-found.module';
// import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LocalStorageModule.forRoot(<ILocalStorageServiceConfig>environment.localStorage),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ToastrModule.forRoot({closeButton: true}),
    // ------ Application Modules -------
    BrowseQueryModule,
    NavigationModule,
    PageNotFoundModule
  ],
  // providers: [AppComponent],
  bootstrap: [AppComponent],
  // entryComponents: [AppComponent]
})
export class AppModule {

  constructor(private readonly injector: Injector) {}

  // ngDoBootstrap() {
    // const el = createCustomElement(AppComponent, { injector: this.injector });
    // customElements.define('app-embeded', el);
  // }

}
