import { Component, ViewContainerRef } from '@angular/core';

// Simple child component
@Component({
  selector: 'app-component-with-view-container',
  template: '<div></div>'
})
export class SimpleChildComponent {
  public constructor(public viewContainerRef: ViewContainerRef) { }
}
