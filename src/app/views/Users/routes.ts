import { Routes } from '@angular/router';

 
 export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Users'
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
        title: 'Manage users',
        }
    },
    {
        path: 'add',
        loadComponent: () => import('./add-user/add-user.component').then(m => m.AddUserComponent),  
    },

    {
        path: 'Back to list',
        loadComponent: () => import('./manage/manage.component').then(m => m.ManageComponent),
    },
{
    path: 'display/:id',
    loadComponent: () => import('./display/display.component').then(m => m.DisplayComponent),
},
{
    path: 'update/:id',
    loadComponent: () => import('./update/update.component').then(m => m.UpdateComponent),
},

// add path for add admin :
{
    path:'add-admin',
    loadComponent:()=> import('./add-admin/add-admin.component').then(m => m.AddAdminComponent),
}
    ]
}
];
