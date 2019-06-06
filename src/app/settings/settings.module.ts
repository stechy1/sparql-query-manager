import { NgModule } from '@angular/core';

import { ShareModule } from '../share/share.module';

import { SettingsComponent } from './settings.component';
import { QueryModule } from '../query/query.module';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    ShareModule,
    SettingsRoutingModule,
    QueryModule
  ]
})
export class SettingsModule {

}
