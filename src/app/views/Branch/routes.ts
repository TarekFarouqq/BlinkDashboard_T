import { AddBranchComponent } from './manage-branch/add-branch/add-branch.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Branch'
    },
    children: [
      {
        path: '',
        redirectTo: 'manage',
        pathMatch: 'full'
      },

      {
        path: 'manage',
        loadComponent: () => import('./manage-branch/manage-branch.component').then(m => m.ManageBranchComponent),
        data: {
          title: 'Manage Inventories'
        }
      },
      {
        path: 'add',
        loadComponent: () => import('./manage-branch/add-branch/add-branch.component').then(m => m.AddBranchComponent),
        data: {
          title: 'Add Inventory'
        }
      },
      {
        path: 'update/:id',
        loadComponent: () => import('./manage-branch/update-branch/update-branch.component').then(m => m.UpdateBranchComponent),
        data: {
          title: 'Add Inventory'
        }
      }
      
    ]
  }
];


