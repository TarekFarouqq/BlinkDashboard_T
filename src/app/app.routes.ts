//add route here
 
import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';
 

export const routes: Routes = [

  
  {
    path: '',
    redirectTo: 'dashboard',
    
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },

      // add users :
      {
        path:'Users',
       // canActivate: [adminGuard],
        loadChildren: () => import('./views/Users/routes').then((m) => m.routes)
      },
      {
        path: 'product',
        
        loadChildren: () => import('./views/product/routes').then((m) => m.routes)
      },
      {
        path: 'inventory',
        canActivate: [adminGuard],
        loadChildren: () => import('./views/inventory/routes').then((m) => m.routes)
      },
      {
        path: 'branch',
        canActivate: [adminGuard],
        loadChildren: () => import('./views/Branch/routes').then((m) => m.routes) 
      },
 
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'Brand',
        canActivate: [adminGuard],
        loadChildren: () => import('./views/Brand/routes').then((m) => m.routes)
      },

    
    ]
  },


  {
    path: 'login',
    loadComponent: () => import('./views/login/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },

  {
    path: 'logout',
    loadComponent: () => import('./views/Logout/logout/logout.component').then(m => m.LogoutComponent),
    data: {
      title: 'logout Page'
    }
  },

  { path: '**', redirectTo: 'dashboard' }
];
