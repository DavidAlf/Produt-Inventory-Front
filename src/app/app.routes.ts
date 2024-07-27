import { Routes } from '@angular/router';
import { InitialComponent } from './modulos/initial/initial.component';
import { CategoriesComponent } from './modulos/categories/categories.component';
import { ProductsComponent } from './modulos/products/products.component';
import { InventoryComponent } from './modulos/inventory/inventory.component';
import { NotFoundComponent } from './modulos/not-found/not-found.component';

export const routes: Routes = [
    {
        path: 'initial',
        component: InitialComponent,
    },
    {
        path: 'categories',
        component: CategoriesComponent,
    },
    {
        path: 'products',
        component: ProductsComponent,
    },
    {
        path: 'inventory',
        component: InventoryComponent,
    },
    {
        path: '',
        redirectTo: 'initial',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFoundComponent,
        children: [
            {
                path: 'initial',
                component: InitialComponent,
            }
        ]
    },
];
