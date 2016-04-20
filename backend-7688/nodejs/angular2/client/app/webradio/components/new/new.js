import { Component } from 'angular2/core';
import { Router } from 'angular2/router';
import template from './new.html';
import { WebradioService } from '../../services/webradio';
import { FormComponent } from './../form/form';

@Component({
  selector: 'new',
  template: template,
  directives: [FormComponent]
})
export class NewComponent {
  constructor(webradioService: WebradioService, router: Router) {
    this._webradioService = webradioService;
    this._router = router;
  }

  onSave(item) {
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
