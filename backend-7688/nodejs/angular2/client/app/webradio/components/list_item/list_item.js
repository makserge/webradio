import { Component, ChangeDetectionStrategy } from 'angular2/core';
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
 
  constructor() {
	this.baseHost = config.baseHost;
  }
  
  toggleEditMode() {
	  
  }
  
  deleteItem() {
	  
  }
}
