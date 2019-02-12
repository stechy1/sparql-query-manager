import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSidebar]'
})
export class SidebarDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
