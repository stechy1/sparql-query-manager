import { Injectable, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { SidebarComponent } from './sidebar.component';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';

interface RouterData {
  sidebar: Type<any>;
  navbar: Type<any>;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private _navbar = new Subject<Type<NavbarComponent>>();
  private _sidebar = new Subject<Type<SidebarComponent>>();

  constructor(private _router: Router) {
    this._router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        const routerData = <RouterData> data.state.root.firstChild.data;
        this.setSidebar(routerData.sidebar || null);
        this.setNavbar(routerData.navbar || null);
      }
    });
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
