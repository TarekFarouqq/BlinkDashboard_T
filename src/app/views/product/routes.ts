import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Product'
    },
    children: [
      {
        path: '',
        redirectTo: 'manage',
        pathMatch: 'full'
      },

      {
        path: 'manage',
        loadComponent: () => import('./manage/manage.component').then(m => m.ManageComponent),
        data: {
          title: 'Manage Products'
        }
      },
      {
        path: 'product-details/:id',
        loadComponent: () => import('./product-details/product-details.component').then(m => m.ProductDetailsComponent),
        data: {
          title: 'Product Details'
        }
      }
    ]
  }
];


