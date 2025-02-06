import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'invoice-list',
    pathMatch: 'full'
  },
  {
    path: 'invoice-list',
    loadComponent: () => import('./pages/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent)
  },
  {
    path: 'invoice-list/invoice/:id',
    loadComponent: () => import('./pages/invoice-details/invoice-details.component').then(m => m.InvoiceDetailsComponent)
  },
  {
    path: '**',
    redirectTo: 'invoice-list'
  }
];
