import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';
import { authGuard, publicGuard } from './shared/guards/auth/auth.guard';
import { deactivateGuard } from './shared/guards/deactivate/deactivate.guard';

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
    canActivate: [publicGuard],
  },
  {
    path: 'rendszer',
    title: 'Ágas és Bogas | Rendszer',
    loadComponent: () =>
      import('./pages/system/system.component').then((m) => m.SystemComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    title: 'Regisztráció',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    canActivate: [publicGuard],
  },
  {
    path: 'login',
    title: 'Bejelentkezés',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'profil',
    title: 'Ébredő Világok | Profil',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [authGuard],
  },
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
    title: 'Ágas és Bogas | Fajok',
    loadComponent: () =>
      import(
        './pages/world/species/species-template/species-template.component'
      ).then((m) => m.SpeciesTemplateComponent),
  },
  {
    path: 'tajak',
    title: 'Tájak és Királyságok',
    loadComponent: () =>
      import('./pages/world/lands/lands.component').then(
        (m) => m.LandsComponent
      ),
    canActivate: [publicGuard],
  },
  {
    path: 'terkep',
    title: 'Ébredő Világok | Térkép',
    loadComponent: () =>
      import('./pages/map/map.component').then((m) => m.MapComponent),
    canActivate: [publicGuard],
  },
  /*{
    path: 'forum',
    title: 'Ébredő Világok | Fórum',
    loadComponent: () =>
      import('./pages/forum/forum.component').then((m) => m.ForumComponent),
    canActivate: [publicGuard],
  },*/
  {
    path: 'karakter-keszito',
    title: 'Karakter készítő',
    loadComponent: () =>
      import('./pages/creator/karakter/karakter.component').then(
        (m) => m.KarakterComponent
      ),
    canActivate: [authGuard],
    canDeactivate: [deactivateGuard],
  },
  {
    path: 'kaland-keszito',
    title: 'Kaland készítő',
    loadComponent: () =>
      import('./pages/creator/adventure/adventure.component').then(
        (m) => m.AdventureComponent
      ),
    canActivate: [authGuard],
    canDeactivate: [deactivateGuard],
  },
  /* {
    path: 'jatek',
    title: 'Játék',
    loadComponent: () =>
      import('./pages/game/game.component').then((m) => m.GameComponent),
    canActivate: [authGuard],
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
