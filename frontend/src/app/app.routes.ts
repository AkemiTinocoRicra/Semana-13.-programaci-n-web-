import { Routes } from '@angular/router';
import { authGuard, invitadoGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'personas',
  },
  {
    path: 'login',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./components/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'personas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/personas-list/personas-list').then((m) => m.PersonasList),
  },
  {
    path: 'personas/nuevo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/persona-form/persona-form').then((m) => m.PersonaForm),
  },
  {
    path: 'personas/:id/editar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/persona-form/persona-form').then((m) => m.PersonaForm),
  },
  {
    path: '**',
    redirectTo: 'personas',
  },
];
