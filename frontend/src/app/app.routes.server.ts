import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // La sesión vive en localStorage, así que estas rutas se renderizan en el cliente.
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'registro',
    renderMode: RenderMode.Client,
  },
  {
    path: 'personas',
    renderMode: RenderMode.Client,
  },
  {
    path: 'personas/nuevo',
    renderMode: RenderMode.Client,
  },
  {
    path: 'personas/:id/editar',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
