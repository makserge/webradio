import { WebradioListComponent } from '../../../webradio/components/list/list';
import { NewComponent } from '../../../webradio/components/new/new';
import { EditComponent } from '../../../webradio/components/edit/edit';

export const router = {
  config: [
    { path: '/', component: WebradioListComponent, name: 'WebradioList', useAsDefault: true },
    { path: '/new', component: NewComponent, name: 'New' },
    { path: '/edit/:id', component: EditComponent, name: 'Edit' },
  ]
};
