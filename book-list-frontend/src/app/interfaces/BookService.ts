import {Book} from './Book';

export interface BookListParams {
    title?: string;
    author?: string;
    isbn?: string;
    page?: number;
}

export interface BookListResponse {
    count: number;
    pages: number;
    items: Book[];
}
