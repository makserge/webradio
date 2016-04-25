import { Component, ChangeDetectionStrategy, Output, EventEmitter } from 'angular2/core';
import template from './list_item.html';
import { config } from '../../../core/config'

@Component({
  selector: 'list-item',
  template: template,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['item', 'showEditControls']
})
export class ListItemComponent {
  item;
  showEditControls;
 
  @Output()
  deleted = new EventEmitter();
  
  constructor() {
	this.baseHost = config.baseHost;
  }
  
  toggleEditMode() {
	//this.showEditControls != this.showEditControls;
  }
  
  deleteItem() {
	this.deleted.emit(this.item.id);
	return false;
  }
  
}
