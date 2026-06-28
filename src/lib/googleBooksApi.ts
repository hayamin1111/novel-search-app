import type { GoogleBooksItem, Book } from "@/types/book";

// 環境変数チェック
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY is not set");
}

/**
 * Google Books APIでSF書籍を検索し、アプリ用のBook配列に変換して返す
 */
export const searchBooks = async (searchWord: string): Promise<Book[]> => {
  // URL生成
  const params = new URLSearchParams({
    q: `intitle:${searchWord}`,
    // q: `${searchWord} subject:science-fiction`,
    printType: "books",
    maxResults: "10",
    key: apiKey,
  });
  const url = `https://www.googleapis.com/books/v1/volumes?${params.toString()}`;

  // fetchしてjson受け取る
  const response = await fetch(url);
  console.log(response);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("fetch error", response.status, errorText);
    throw new Error(`fetch error: ${response.status}`);
  }
  const json = await response.json();
  console.log(json.items);

  const items: GoogleBooksItem[] = json.items ?? [];

  const books: Book[] = items.map((item) => ({
    id: item.id,
    title: item.volumeInfo?.title ?? "タイトル不明",
    authors: item.volumeInfo?.authors ?? ["著者不明"],
  }));

  return books;
};
