import { Injectable, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { SidebarComponent } from './sidebar.component';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private _navbar = new Subject<Type<NavbarComponent>>();
  private _sidebar = new Subject<Type<SidebarComponent>>();

  constructor() {
  }

  setNavbar(navbar: Type<NavbarComponent>) {
    this._navbar.next(navbar);
  }

  get navbar(): Observable<Type<NavbarComponent>> {
    return this._navbar.asObservable();
  }

  setSidebar(sidebar: Type<any>) {
    this._sidebar.next(sidebar);
  }

  get sidebar(): Observable<Type<any>> {
    return this._sidebar.asObservable();
  }

}
