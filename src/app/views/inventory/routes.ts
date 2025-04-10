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
      {
        path: 'add',
        loadComponent: () => import('./add-inventory/add-inventory.component').then(m => m.AddInventoryComponent),
        data: {
          title: 'Add Inventory'
        }
      },
      {
        path: 'update/:id',
        loadComponent: () => import('./update-inventory/update-inventory.component').then(m => m.UpdateInventoryComponent), 
        data: {
          title: 'Update Inventory'
        }
      }
      
    ]
  }
];


