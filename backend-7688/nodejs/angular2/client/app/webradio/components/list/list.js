import { Component, ChangeDetectionStrategy } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import template from './list.html';
import { WebradioService } from '../../services/webradio';
import { ListItemComponent } from './../list_item/list_item';
import { config } from '../../../core/config'

@Component({
  selector: 'list',
  template: template,
  directives: [ROUTER_DIRECTIVES, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.Detached,
  pipes: [TranslatePipe]
})
export class WebradioListComponent {
  constructor(webradioService: WebradioService) {
    this._webradioService = webradioService;
	this.baseHost = config.baseHost;
  }

  ngOnInit() {
    this._webradioService.refreshItems();
  }

  getItems() {
    return this._webradioService.remoteItems;
  }
}
