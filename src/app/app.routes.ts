import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'overview', loadComponent: () => import('./components/overview/overview.component').then(m => m.OverviewComponent) },
    { path: 'summary', loadComponent: () => import('./components/summary/summary.component').then(m => m.SummaryComponent) },
    { path: '', redirectTo: '/overview', pathMatch: 'full' },
    { path: '**', redirectTo: '/overview' }
  ];
