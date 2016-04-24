import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
import { config } from '../../core/config'

@Injectable()
export class WebradioService {
  remoteItems = new BehaviorSubject([]);

  constructor(http: Http) {
    this._http = http;
  }

  refreshItems() {
    let itemsResponse = this._http.get(config.baseHost + 'network')
      .map(res => res.json())
	  .subscribe(
        (items) => {
          this.remoteItems.next(items);
        },
        (error) => {
          console.error(error);
        }
      );

    return itemsResponse;
  }

  addItem(item) {
    return this._http
      .post(config.baseHost + 'network/add', JSON.stringify(item), {  })
      .map(res => res.json());
  }

  getItem(id) {
    return this._http.get(`/post/${id}`)
      .map(res => res.json());
  }

  updateItem(item) {
    return this._http
      .post(`/post/${item._id}`, JSON.stringify(item), {  })
      .map(res => res.json());
  }
}
