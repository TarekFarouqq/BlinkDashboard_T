import { Routes } from '@angular/router';

import { ProdcutsComponent } from './/prodcuts.component';

export const routes: Routes = [
  {
    path: '',
    component: ProdcutsComponent,
    data: {
      title: 'Products'
    }
  }
];
