export type GoogleBooksItem = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
  };
};

export type Book = {
  id: string;
  title: string;
  authors: string[];
};
