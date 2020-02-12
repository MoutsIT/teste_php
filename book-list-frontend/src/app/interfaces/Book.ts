interface Images {
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extralarge?: string;
}

export interface Book {
    id: string;
    title: string;
    isbn: string;
    author: string;
    publisher: string;
    year: string;
    description?: string;
    pageCount?: number;
    images: Images;
}
