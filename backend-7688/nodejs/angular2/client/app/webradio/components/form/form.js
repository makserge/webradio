import { Component, EventEmitter, Input, Output } from 'angular2/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { FormBuilder, Validators } from 'angular2/common';
import template from './form.html';
import { validatorFactory, duplicateValidator } from '../../validator';

@Component({
  selector: 'item-form',
  template: template,
  pipes: [TranslatePipe],
  inputs: ['items']
})
export class FormComponent {
  items;
  
  @Input()
  item;
  
  @Output()
  saved = new EventEmitter();
  
  @Output()
  canceled = new EventEmitter();

  constructor(builder: FormBuilder) {
	this._builder = builder;
  }
  
  ngOnInit() {
    this.itemForm = this._builder.group({
      title: ['', Validators.compose([Validators.required, duplicateValidator(this.items)])],
      url: ['', Validators.compose([Validators.required, validatorFactory('url')])]
    });
  }

  ngOnChanges(change) {
    if (change.item && change.item.currentValue) {
      this.itemForm.controls['title'].updateValue(change.item.currentValue.title);
      this.itemForm.controls['url'].updateValue(change.item.currentValue.url);
    }
  }

  onSubmit(item) {
	var out = {};  
	out.title = item.title.trim();
	out.value = item.url.trim();
	out.order = (parseInt(this.items[this.items.length - 1].order) + 1) + "";
	
    this.saved.emit(out);
  }
  
  cancelNewItemForm() {
    this.canceled.emit(null);
  }

}
