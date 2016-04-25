import { Component, ChangeDetectionStrategy } from 'angular2/core';
import { TranslatePipe, TranslateService } from 'ng2-translate/ng2-translate';
import template from './list.html';
import { WebradioService } from '../../services/webradio';
import { ListItemComponent } from './../list_item/list_item';
import { FormComponent } from './../form/form';
import { Modal } from 'angular2-modal';
import { config } from '../../../core/config'

@Component({
  selector: 'list',
  template: template,
  directives: [ListItemComponent, FormComponent],
  providers: [Modal],
  changeDetection: ChangeDetectionStrategy.Detached,
  pipes: [TranslatePipe]
})
export class WebradioListComponent {

  constructor(webradioService: WebradioService, modal: Modal, translate: TranslateService) {
    this.webradioService = webradioService;
	this.modal = modal;
	this.translate = translate;
	this.baseHost = config.baseHost;

	this.showNewItemForm = false;
	this.showEditControls = false;
	this.showDuplicateError = false;
  }

  ngOnInit() {
    this.webradioService.refreshItems();
  }

  getItems() {
    return this.webradioService.remoteItems;
  }
  
  toggleNewItemForm() {
    this.showNewItemForm = !this.showNewItemForm;
	return false;
  }
  
  toggleEditMode() {
    this.showEditControls = !this.showEditControls;
	return false;
  }
  
  onAddItem(item) {
    this.webradioService.addItem(item).subscribe(
      (res) => {
		if (res.result == "ok") {
			this.showNewItemForm = false;
			this._webradioService.refreshItems();
		}
		else {
			this.showDuplicateError = true;
		}
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  onCancel(item) {
	this.showNewItemForm = false;
  }
  
  onDelete(item) {
	this.modal.confirm()
      .size('sm')
      .titleHtml(this.translate.instant('delete_item_title'))
      .body(this.translate.instant('delete_item_message'))
	  .open()
	  .then((resultPromise) => {
		return resultPromise.result.then((result) => {
          console.log(item);
        }, () => this.lastModalResult = 'Rejected!');
      });
  }
}
