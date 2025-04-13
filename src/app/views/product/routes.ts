import { Routes } from '@angular/router';
import { adminGuard } from '../../../guards/admin.guard';

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
          title: 'Manage-Products'
        }
      },
      {
        path: 'product-details/:id',
        loadComponent: () => import('./product-details/product-details.component').then(m => m.ProductDetailsComponent),
        data: {
          title: 'Product-Details'
        }
      },
      {
        path: 'product-attributes',
        loadComponent: () => import('./product-attributes/product-attributes.component').then(m => m.ProductAttributesComponent),
        data: {
          title: 'Product-Attributes'
        }
      },
      {
        path: 'product-attributes-details/:id',
        loadComponent: () => import('./product-attributes-details/product-attributes-details.component').then(m => m.ProductAttributesDetailsComponent),
        data: {
          title: 'Product-Attributes-Details'
        }
      },
      {
        path: 'review-products',
         canActivate: [adminGuard],
        loadComponent: () => import('./review-products/review-products.component').then(m => m.ReviewProductsComponent),
        data: {
          title: 'review-products'
        }
      },
    ]
  }
];


