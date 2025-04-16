import { Routes } from '@angular/router';
import { adminGuard } from '../../../guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Category'
    },
    children: [
      {
        path: '',
        redirectTo: 'manage',
        pathMatch: 'full'
      },

      {
        path: 'manage',
         canActivate: [adminGuard],
        loadComponent: () => import('./manage-category/manage-category.component').then(m => m.ManageCategoryComponent),
        data: {
          title: 'Manage-Category'
        }
      },
      {
        path: 'details/:id',
         canActivate: [adminGuard],
        loadComponent: () => import('./category-details/category-details.component').then(m => m.CategoryDetailsComponent),
        data: {
          title: 'Category-Details'
        }
      },
    ]
  }
];


