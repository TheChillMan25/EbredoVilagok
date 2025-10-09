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
    path: 'vilag',
    title: 'Ágas és Bogas | Világ',
    loadComponent: () =>
      import('./pages/world/world.component').then((m) => m.WorldComponent),
  },
  {
    path: 'rendszer',
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
    path: 'fajok',
    title: 'Ágas és Bogas | Fajok',
    loadComponent: () =>
      import('./pages/world/species/species.component').then(
        (m) => m.SpeciesComponent
      ),
  },
  {
    path: 'fajok/:id',
    title: 'Fajok',
    loadComponent: () =>
      import(
        './pages/world/species/species-template/species-template.component'
      ).then((m) => m.SpeciesTemplateComponent),
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
