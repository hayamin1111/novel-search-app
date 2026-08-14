import type { Book, BookDetail } from "@/types/book";

/**
 * Route HandlerでのAPIエンドポイントからfetchしてBook配列を返す
 */
export const searchBooks = async (searchWord: string, startIndex = 0): Promise<Book[]> => {
  const params = new URLSearchParams({
    q: searchWord,
    startIndex: startIndex.toString(),
  });

  const response = await fetch(`/api/books?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`searchBooks fetch error: ${response.status}`);
  }
  const books: Book[] = await response.json();
  return books;
};

/**
 * Route HandlerでのAPIエンドポイントから詳細情報を取得
 */
export const getBookDetail = async (id: string): Promise<BookDetail> => {
  const response = await fetch(`/api/books/${encodeURIComponent(id)}`);
  if (!response.ok) {
    throw new Error(`getBookDetail fetch error: ${response.status}`);
  }
  const bookDetail: BookDetail = await response.json();
  return bookDetail;
};
