import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Inventory'
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
          title: 'Manage Inventories'
        }
      },
      
    ]
  }
];


