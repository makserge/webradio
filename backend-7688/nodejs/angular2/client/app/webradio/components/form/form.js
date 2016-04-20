import { Component, EventEmitter, Input, Output } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import template from './form.html';
import { validatorFactory } from '../../validator';

@Component({
  selector: 'item-form',
  template: template
})
export class FormComponent {
  @Input()
  item;

  @Output()
  saved = new EventEmitter();

  constructor(builder: FormBuilder) {
    this.itemForm = builder.group({
      _id: [''],
      name: ['', Validators.required],
      website: ['', Validators.compose([Validators.required, validatorFactory('url')])],
      description: ['']
    });
  }

  ngOnChanges(change) {
    if (change.item && change.item.currentValue) {
      this.itemForm.controls['_id'].updateValue(change.item.currentValue._id);
      this.itemForm.controls['name'].updateValue(change.item.currentValue.name);
      this.itemForm.controls['website'].updateValue(change.item.currentValue.website);
      this.itemForm.controls['description'].updateValue(change.item.currentValue.description);
    }
  }

  onSubmit(item) {
    this.saved.emit(item);
  }
}
