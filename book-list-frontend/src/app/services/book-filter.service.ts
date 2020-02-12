import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {BookListParams} from '../interfaces/BookService';

@Injectable({
    providedIn: 'root'
})
export class BookFilterService {
    filterValues = new BehaviorSubject<BookListParams>(null);
    values: BookListParams = null;

    public setFilterValues(values: BookListParams) {
        if (values) {
            this.filterValues.next(values);
        }

        this.values = values;
    }

    public setPage(page: number) {
        if (this.values) {
            this.values.page = page;

            this.filterValues.next(this.values);
        }
    }
}
