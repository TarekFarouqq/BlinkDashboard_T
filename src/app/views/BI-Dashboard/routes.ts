import { Routes } from '@angular/router';

 
 export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'BI-Dashboard'
          },
        children: [
            {
            path: '',
            redirectTo: 'customers',
            pathMatch: 'full'
            },
            {
                path: 'customers',
                loadComponent: () => import('./customers/customers.component').then(m => m.CustomersComponent),
                data: {
                title: 'Customers',
                }
            },
           
                {
                    path: 'products',
                    loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
                    data: {
                    title: 'Products',
                    }
                }

   
    ]
}
];
