import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appNavbar]'
})
export class NavbarDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
