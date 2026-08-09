import type { Book } from "@/types/book";

export type SearchSnapshot = {
  query: string;
  books: Book[];
  nextStartIndex: number;
  hasMore: boolean;
  scrollY: number;
  savedAt: number;
};
