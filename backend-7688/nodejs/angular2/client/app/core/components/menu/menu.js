import { Component, ChangeDetectionStrategy } from 'angular2/core';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import template from './menu.html';

@Component({
  selector: 'top-menu',
  template: template,
  directives: [ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [TranslatePipe]
})
export class MenuComponent {
  static get parameters() {
    return [[Router]];
  }

  constructor(router) {
    this._router = router;
  }

}
