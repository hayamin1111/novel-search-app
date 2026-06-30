export type GoogleBooksItem = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
};

export type Book = {
  id: string;
  title: string;
  authors: string[];
  publishedDate?: string;
  thumbnail?: string;
};

export type BookDetail = {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount?: number;
  thumbnail?: string;
  previewLink?: string;
};
