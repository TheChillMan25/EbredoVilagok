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
    path: 'world',
    title: 'Ágas és Bogas | Világ',
    loadComponent: () =>
      import('./pages/world/world.component').then((m) => m.WorldComponent),
  },
  {
    path: 'system',
    title: 'Ágas és Bogas | Rendszer',
    loadComponent: () =>
      import('./pages/system/system.component').then((m) => m.SystemComponent),
  },
  /* {
    path: 'register',
    title: 'Regisztráció',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  }, */
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
