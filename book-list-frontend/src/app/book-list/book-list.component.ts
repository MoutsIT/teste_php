import {Component, OnInit} from '@angular/core';

import {Book} from '../interfaces/Book';
import {BookListParams} from '../interfaces/BookService';

import {BookService} from '../services/book.service';
import {BookFilterService} from '../services/book-filter.service';

@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

    public list: Book[] = [];
    public page = 1;
    public maxPage = 1;
    public count = 0;

    constructor(private bookService: BookService, private bookFilterService: BookFilterService) {
    }

    setValues(list: Book[], page: number, maxPage: number, count: number) {
        this.list = list;
        this.page = page;
        this.maxPage = maxPage;
        this.count = count;
    }

    filter(params: BookListParams) {
        this.bookService
            .list(params)
            .subscribe((response) => {
                this.setValues(response.items, params.page || 1, response.pages, response.count);
            }, () => {
                this.setValues([], 1, 0, 0);
            });
    }

    getPages() {
        const start = Math.max(1, Math.min(this.maxPage - 4, this.page - 2));
        const end = Math.min(this.maxPage, Math.max(1, this.page - 2) + 4);
        const list = [];

        for (let i = start; i <= end; i++) {
            list.push(i);
        }

        return list;
    }

    setPage(page) {
        this.list = [];
        this.bookFilterService.setPage(page);
    }

    ngOnInit(): void {
        this.bookFilterService
            .filterValues
            .subscribe(
                (params) => {
                    if (params) {
                        this.filter(params);
                    }
                }, (error) => {
                    console.log(error);
                }
            );
    }
}
