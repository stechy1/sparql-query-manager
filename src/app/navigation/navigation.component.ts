import { Component, ComponentFactoryResolver, ComponentRef, OnInit, Type, ViewChild } from '@angular/core';
import { NavigationService } from './navigation.service';
import { NavbarDirective } from './navbar.directive';
import { SidebarDirective } from './sidebar.directive';
import { NavbarComponent } from './navbar.component';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  @ViewChild(NavbarDirective) navbar: NavbarDirective;
  @ViewChild(SidebarDirective) sidebar: SidebarDirective;
  showSidebar: boolean;
  private _navbarComponentComponentRef: ComponentRef<NavbarComponent>;
  private _sidebarComponentComponentRef: ComponentRef<SidebarComponent>;

  constructor(private _navService: NavigationService, private _componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.showSidebar = false;

    this._navService.navbar.subscribe(value => {
      if (this._navbarComponentComponentRef !== undefined) {
        this._navbarComponentComponentRef.destroy();
      }
      if (value === undefined || value === null) {
        return;
      }

      const navbar = <Type<NavbarComponent>> value;

      const componentFactory = this._componentFactoryResolver.resolveComponentFactory(navbar);

      const viewContainerRef = this.navbar.viewContainerRef;
      viewContainerRef.clear();

      this._navbarComponentComponentRef = viewContainerRef.createComponent(componentFactory);

    });
    this._navService.sidebar.subscribe(value => {
      if (this._sidebarComponentComponentRef !== undefined) {
        this._sidebarComponentComponentRef.destroy();
      }
      if (value === undefined || value === null) {
        return;
      }

      const sidebar = <Type<SidebarComponent>>value;

      const componentFactory = this._componentFactoryResolver.resolveComponentFactory(sidebar);

      const viewContainerRef = this.sidebar.viewContainerRef;
      viewContainerRef.clear();

      this._sidebarComponentComponentRef = viewContainerRef.createComponent(componentFactory);
    });
  }

}
