import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BookFilterService} from '../services/book-filter.service';

@Component({
    selector: 'app-book-list-filter',
    templateUrl: './book-list-filter.component.html',
    styleUrls: ['./book-list-filter.component.css']
})
export class BookListFilterComponent {
    filterValues = new FormGroup({
        title: new FormControl('A torre de ouro'),
        author: new FormControl('Cassandra'),
        isbn: new FormControl('')
    });

    constructor(private service: BookFilterService) {
    }

    submit() {
        this.service.setFilterValues(this.filterValues.value);
    }
}
