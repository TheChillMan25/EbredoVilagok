import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';

export const routes: Routes = [
  {
    path: 'index',
    title: 'Ébredő Világok',
    component: IndexComponent,
  },
  {
    path: '',
    redirectTo: '/index',
    pathMatch: 'full',
  },
];
