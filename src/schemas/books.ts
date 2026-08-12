import { z } from "zod";

// Google Books API の中身検証
export const GoogleBooksItemSchema = z.object({
  id: z.string(),
  volumeInfo: z.object({
    title: z.string().optional(),
    authors: z.array(z.string()).optional(),
    publisher: z.string().optional(),
    publishedDate: z.string().optional(),
    imageLinks: z
      .object({
        thumbnail: z.string().optional(),
      })
      .optional(),
    description: z.string().optional(),
    pageCount: z.number().optional(),
    previewLink: z.string().optional(),
  }),
});

// Google Books API レスポンス（itemsのみ）の検証
export const GoogleBooksSearchResponseSchema = z.object({
  items: z.array(z.unknown()).optional(),
});

// SearchSnapshot内のBook[]検証
export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  publishedDate: z.string(),
  thumbnail: z.string().optional(),
});
