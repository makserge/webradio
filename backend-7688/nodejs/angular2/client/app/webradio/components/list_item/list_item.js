import { Component, ChangeDetectionStrategy } from 'angular2/core';
import template from './list_item.html';

@Component({
  selector: 'list-item',
  template: template,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['item']
})
export class ListItemComponent {
  item;
  
}
