import { Component } from 'angular2/core';
import { RouteParams, Router } from 'angular2/router';
import template from './edit.html';
import { WebradioService } from '../../services/webradio';
import { FormComponent } from './../form/form';

@Component({
  selector: 'edit',
  template: template,
  directives: [FormComponent]
})
export class EditComponent {
  constructor(webradioService: WebradioService, params: RouteParams, router: Router) {
    this._webradioService = webradioService;
    this._params = params;
    this._router = router;
  }

  ngOnInit() {
    this.item = this._webradioService
      .getItem(this._params.get('id'));
  }

  onSave(item) {
    this._webradioService.updateItem(item).subscribe(
      () => {
        this._router.navigate(['List']);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
