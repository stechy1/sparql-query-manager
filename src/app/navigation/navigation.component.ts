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

  // Reference na místo v navigačním menu
  @ViewChild(NavbarDirective, { static: true }) navbar: NavbarDirective;
  // Reference na místo v postranním menu
  @ViewChild(SidebarDirective, { static: true }) sidebar: SidebarDirective;

  // True, pokud se má zobrazit sidebar, jinak false
  showSidebar: boolean;

  // Reference na komponentu v navigační liště
  private _navbarComponentComponentRef: ComponentRef<NavbarComponent>;
  // Reference na komponentu v postranním menu
  private _sidebarComponentComponentRef: ComponentRef<SidebarComponent>;

  constructor(private _navService: NavigationService, private _componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    // Na začázku se nezobrazuje postraní lišta
    this.showSidebar = false;

    // Přihlásím se k odběru změn navbaru
    this._navService.navbar.subscribe(value => {
      // Pokud existuje stará koponenta
      if (this._navbarComponentComponentRef !== undefined) {
        // Tak ji zničím
        this._navbarComponentComponentRef.destroy();
        this._navbarComponentComponentRef = undefined;
      }
      // Pokud nová hodnota je null, nebo undefined
      if (value === undefined || value === null) {
        // Nebudu dělat nic dalšího
        return;
      }

      // Přetypuji novou hodnotu na navigační komponentu
      const navbar = <Type<NavbarComponent>> value;

      // Získám referenci na aktuální navigační menu
      const viewContainerRef = this.navbar.viewContainerRef;
      // Vyčistím staré komponenty
      viewContainerRef.clear();

      // Získám novou továrnu
      const componentFactory = this._componentFactoryResolver.resolveComponentFactory(navbar);
      // Pomocí továrny vytvořím novou navigační komponentu
      this._navbarComponentComponentRef = viewContainerRef.createComponent(componentFactory);

    });
    // Přihlásím se k odběru změn postranního menu
    this._navService.sidebar.subscribe(value => {
      // Pokud existuje stará komponenta
      if (this._sidebarComponentComponentRef !== undefined) {
        // Tak ji zničím
        this._sidebarComponentComponentRef.destroy();
        this._sidebarComponentComponentRef = undefined;
      }
      // Pokud nová hodnota je null, nebo undefined
      if (value === undefined || value === null) {
        // Nebudu dělat nic dalšího
        return;
      }

      // Přetypuji novou hodnotu na sidebar komponentu
      const sidebar = <Type<SidebarComponent>>value;

      // Získám referenci na aktuální sidebar
      const viewContainerRef = this.sidebar.viewContainerRef;
      // Vyčistím staré komponenty
      viewContainerRef.clear();

      // Získám novou továrnu
      const componentFactory = this._componentFactoryResolver.resolveComponentFactory(sidebar);
      // Pomocí továrny vytvořím novou sidebar komponentu
      this._sidebarComponentComponentRef = viewContainerRef.createComponent(componentFactory);
    });
  }

}
