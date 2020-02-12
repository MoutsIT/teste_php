import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {BookService} from '../services/book.service';
import {Book} from '../interfaces/Book';

@Component({
    selector: 'app-book-details',
    templateUrl: './book-details.component.html',
    styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

    book: Book;

    constructor(private route: ActivatedRoute, private bookService: BookService) {
    }

    ngOnInit(): void {
        this.bookService.find(this.route.snapshot.paramMap.get('id')).subscribe((book: Book) => {
            console.log(book);
            this.book = book;
        }, (error) => {
            console.log(error);
        });
    }

}
