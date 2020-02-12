import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BookListComponent} from './book-list/book-list.component';
import {BookListFilterComponent} from './book-list-filter/book-list-filter.component';

import {BookService} from './services/book.service';
import { BookDetailsComponent } from './book-details/book-details.component';

@NgModule({
    declarations: [
        AppComponent,
        BookListComponent,
        BookListFilterComponent,
        BookDetailsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [BookService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
