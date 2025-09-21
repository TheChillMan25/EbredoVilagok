import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';

export const routes: Routes = [
  {
    path: 'index',
    title: 'Ébredő Világok',
    component: IndexComponent,
  },
  {
    path: 'register',
    title: 'Regisztráció',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        m => m.RegisterComponent
      ),
  },
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: '**',
    title: 'Nem található oldal...',
    component: PagenotfoundComponent,
  },
];
