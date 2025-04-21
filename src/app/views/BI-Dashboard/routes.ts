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
                },
                
                {
                    path: 'branches-inventories',
                    loadComponent: () => import('./branches-inventories/branches-inventories.component').then(m => m.BranchesInventoriesComponent),
                    data: {
                    title: 'Branches & Inventories',
                    }
                },
                {
                    path: 'sales-orders',
                    loadComponent: () => import('./sales-orders/sales-orders.component').then(m => m.SalesOrdersComponent),
                    data: {
                    title: 'Sales & Orders',
                    }
                },
                {
                    path: 'supplier',
                    loadComponent: () => import('./supplier/supplier.component').then(m => m.SupplierComponent),
                    data: {
                    title: 'Supplier',
                    }
                }


   
    ]
}
];
