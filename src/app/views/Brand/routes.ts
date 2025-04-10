import { Routes } from '@angular/router';
 
 export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Brands'
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
        title: 'Manage brands',
        }
    },
    {
        path: 'add',
        loadComponent: () => import('./add-brand/add-brand.component').then(m => m.AddBrandComponent),  
    },

    {
        path: 'Back to list',
        loadComponent: () => import('./manage/manage.component').then(m => m.ManageComponent),
    },
{
    path: 'display/:id',
    loadComponent: () => import('./display/display.component').then(m => m.DisplayComponent),
}
    ]
}
];
