import { z } from "zod";

import { GoogleBooksItemSchema, BookSchema } from "@/schemas/books";

export type GoogleBooksItem = z.infer<typeof GoogleBooksItemSchema>;

export type Book = z.infer<typeof BookSchema>;

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
