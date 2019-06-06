import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavigationComponent } from './navigation.component';

import { NavbarDirective } from './navbar.directive';
import { SidebarDirective } from './sidebar.directive';

@NgModule({
  declarations: [
    NavigationComponent,
    NavbarDirective,
    SidebarDirective
  ],
  imports: [
    RouterModule
  ],
  exports: [
    NavigationComponent,
    NavbarDirective,
    SidebarDirective
  ]
})
export class NavigationModule {

}
