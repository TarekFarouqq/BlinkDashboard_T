import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  {
    name: 'Base',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Navs & Tabs',
        url: '/base/navs',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Pagination',
        url: '/base/pagination',
        icon: 'nav-icon-bullet',
      },

      {
        name: 'Spinners',
        url: '/base/spinners',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Tables',
        url: '/base/tables',
        icon: 'nav-icon-bullet',
      },
    ],
  },

  //Products
  {
    name: 'Product',
    url: '/product',
    iconComponent: { name: 'cilBasket' },
    children: [
      {
        name: 'Manage Products',
        url: '/product/manage',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  //End Products

   //Products
   {
    name: 'Inventory',
    url: '/inventory',
    iconComponent: { name: 'cilLayers' },
    children: [
      {
        name: 'Manage Inventories',
        url: '/inventory/manage',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  //End Products
     //branchs
     {
      name: 'Branch',
      url: '/branch',
      iconComponent: { name: 'cilLayers' },
      children: [
        {
          name: 'Manage Branches',
          url: '/branch/manage',
          icon: 'nav-icon-bullet',
        },
      ],
    },
    //End branchs

  {
    name: 'Charts',
    iconComponent: { name: 'cil-chart-pie' },
    url: '/charts',
  },
 
  {
    name: 'Products',
    iconComponent: { name: 'cilBasket' },
    url: '/products',
  },
 // add brand :

 {
  name: 'Brands',
  url: '/brands',
  iconComponent: { name: 'cil-tags' },
  children: [
    {
      name: 'Manage Brands',
      url: '/Brand/manage',
      icon: 'nav-icon-bullet',
    },
    
  ],
},

 /////////////////////////////////////////////
 
 

  {
    name: 'Widgets',
    url: '/widgets',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Pages',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto',
  },
  {
    name: 'Docs',
    url: 'https://coreui.io/angular/docs/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' },
  },
];
