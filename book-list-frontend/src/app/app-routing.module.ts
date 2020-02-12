import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';


const routes: Routes = [
    {
        path: '',
        component: BookListComponent
    },
    {
        path: ':id',
        component: BookDetailsComponent
    },
    {
        path: '**',
        component: BookListComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
