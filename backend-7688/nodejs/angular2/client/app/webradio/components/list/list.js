import { Component, ChangeDetectionStrategy } from 'angular2/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import template from './list.html';
import { WebradioService } from '../../services/webradio';
import { ListItemComponent } from './../list_item/list_item';
import { FormComponent } from './../form/form';
import { config } from '../../../core/config'

@Component({
  selector: 'list',
  template: template,
  directives: [ListItemComponent, FormComponent],
  changeDetection: ChangeDetectionStrategy.Detached,
  pipes: [TranslatePipe]
})
export class WebradioListComponent {
  
  constructor(webradioService: WebradioService) {
    this._webradioService = webradioService;
	this.baseHost = config.baseHost;

	this.showNewItemForm = false;
  }

  ngOnInit() {
    this._webradioService.refreshItems();
  }

  getItems() {
    return this._webradioService.remoteItems;
  }
  
  toggleNewItemForm() {
    this.showNewItemForm = !this.showNewItemForm;
	return false;
  }
  
  onAddItem(item) {
    this._webradioService.addItem(item).subscribe(
      () => {
        this._router.navigate(['List']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
