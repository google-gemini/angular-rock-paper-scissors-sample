import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'game',
    loadChildren: () => import('./pages/game/game.routes').then((r) => r.routes),
  },
];
