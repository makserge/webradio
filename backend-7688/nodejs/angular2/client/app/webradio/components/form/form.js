import { Component, EventEmitter, Input, Output } from 'angular2/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { FormBuilder, Validators } from 'angular2/common';
import template from './form.html';
import { validatorFactory } from '../../validator';

@Component({
  selector: 'item-form',
  template: template,
  pipes: [TranslatePipe],
  inputs: ['items']
})
export class FormComponent {
  @Input()
  item;
  items;
  
  @Output()
  saved = new EventEmitter();

  constructor(builder: FormBuilder) {
    this.itemForm = builder.group({
      _id: [''],
      title: ['', Validators.required],
      url: ['', Validators.compose([Validators.required, validatorFactory('url')])]
    });
  }

  ngOnChanges(change) {
    if (change.item && change.item.currentValue) {
      this.itemForm.controls['_id'].updateValue(change.item.currentValue._id);
      this.itemForm.controls['title'].updateValue(change.item.currentValue.title);
      this.itemForm.controls['url'].updateValue(change.item.currentValue.url);
    }
  }

  onSubmit(item) {
    this.saved.emit(item);
  }
}
