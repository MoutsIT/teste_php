import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {BookListParams, BookListResponse} from '../interfaces/BookService';
import {Book} from '../interfaces/Book';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    private url = 'http://localhost:8000/api/book';

    constructor(private http: HttpClient) {
    }

    public list(params: BookListParams): Observable<BookListResponse> {
        let httpParams = new HttpParams();

        if (params) {
            for (const param in params) {
                if (params.hasOwnProperty(param) && params[param]) {
                    httpParams = httpParams.set(param, params[param]);
                }
            }
        }

        return this.http.get<BookListResponse>(this.url, {
            params: httpParams
        }).pipe(catchError((error: HttpErrorResponse) => {
            console.log(error.error.message);

            return throwError([]);
        }));
    }

    public find(id): Observable<Book> {
        return this.http.get<Book>(`${this.url}/${id}`);
    }
}
