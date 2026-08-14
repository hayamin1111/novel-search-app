//fetch、HTTPエラー、Zod検証、処理全体の制御
import type { GoogleBooksItem, Book, BookDetail } from "@/types/book";
import { GoogleBooksSearchResponseSchema, GoogleBooksItemSchema } from "@/schemas/books";
import { mapGoogleBooksItemToBook, mapGoogleBooksItemToBookDetail } from "@/lib/googleBooksMapper";

// 環境変数チェック
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY is not set");
}

/**
 * Google Books APIで書籍を検索し、Book配列に変換して返す
 * items[]とその中身でZod検証を分けている
 */
export const searchBooks = async (searchWord: string, startIndex = 0): Promise<Book[]> => {
  // URL生成
  const params = new URLSearchParams({
    q: `intitle:${searchWord}`,
    printType: "books",
    startIndex: startIndex.toString(),
    maxResults: "10",
    key: apiKey,
  });
  const url = `https://www.googleapis.com/books/v1/volumes?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`searchBooks fetch error: ${response.status}`);
  }
  const json = await response.json();

  // Zodでデータ検証（items[]のみ）
  const parsedResponse = GoogleBooksSearchResponseSchema.safeParse(json);
  if (!parsedResponse.success) {
    console.error("Google Books API response validation failed", parsedResponse.error);
    throw new Error("Invalid Google Books API response");
  }

  const items = parsedResponse.data.items ?? [];
  const validItems: GoogleBooksItem[] = [];
  // Zodでデータ検証（items[]の中身）
  for (const item of items) {
    const parsedItem = GoogleBooksItemSchema.safeParse(item);
    if (!parsedItem.success) {
      console.error("Invalid book item", parsedItem.error);
      continue;
    }
    validItems.push(parsedItem.data);
  }

  // 表示用に加工
  const books: Book[] = validItems.map(mapGoogleBooksItemToBook);

  return books;
};

/**
 * Google Books APIのIDによって詳細情報を取得
 */
export const getBookDetail = async (id: string): Promise<BookDetail> => {
  const params = new URLSearchParams({
    key: apiKey,
  });
  const url = `https://www.googleapis.com/books/v1/volumes/${id}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("getBookDetail fetch error", response.status, errorText);
    throw new Error(`getBookDetail fetch error: ${response.status}`);
  }
  const json = await response.json();

  // Zodでデータ検証
  const result = GoogleBooksItemSchema.safeParse(json);
  if (!result.success) {
    console.error("Google Books API response validation failed", result.error);
    throw new Error("Invalid book item");
  }

  // 表示用に加工
  const bookDetail = mapGoogleBooksItemToBookDetail(result.data);

  return bookDetail;
};
