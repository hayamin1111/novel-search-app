import type { GoogleBooksItem, Book, BookDetail } from "@/types/book";

// 環境変数チェック
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY is not set");
}

/**
 * Google Books APIで書籍を検索し、アプリ用のBook配列に変換して返す
 */
export const searchBooks = async (searchWord: string): Promise<Book[]> => {
  // URL生成
  const params = new URLSearchParams({
    q: `intitle:${searchWord}`,
    printType: "books",
    maxResults: "10",
    key: apiKey,
  });
  const url = `https://www.googleapis.com/books/v1/volumes?${params.toString()}`;

  // fetchしてjson受け取る
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`searchBooks fetch error: ${response.status}`);
  }
  const json = await response.json();

  // 生データのnullチェック
  const items: GoogleBooksItem[] = json.items ?? [];

  // 表示用に加工
  const books: Book[] = items.map((item) => {
    const thumbnail = item.volumeInfo?.imageLinks?.thumbnail?.replace("http://", "https://");

    return {
      id: item.id,
      title: item.volumeInfo?.title ?? "タイトル不明",
      authors: item.volumeInfo?.authors ?? ["著者不明"],
      publishedDate: item.volumeInfo?.publishedDate ?? "出版日不明",
      thumbnail,
    };
  });

  return books;
};

/**
 * Google Books APIのIDによって
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

  // 生データのnullチェック
  const item: GoogleBooksItem = json;

  // HTMLタグの処理（brは\n、）
  const stripHtml = (html: string) => {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<wbr\s*\/?>/gi, "")
      .replace(/<[^>]*>/g, "");
  };

  // 表示用に加工
  const thumbnail = item.volumeInfo?.imageLinks?.thumbnail?.replace("http://", "https://");
  return {
    id: item.id,
    title: item.volumeInfo?.title ?? "タイトル不明",
    authors: item.volumeInfo?.authors ?? ["著者不明"],
    publisher: item.volumeInfo?.publisher ?? "出版社不明",
    publishedDate: item.volumeInfo?.publishedDate ?? "出版日不明",
    // descriptionのみHTMLが入っているので別で処理
    description: item.volumeInfo?.description ? stripHtml(item.volumeInfo.description) : "詳細不明",
    pageCount: item.volumeInfo?.pageCount,
    thumbnail,
    previewLink: item.volumeInfo?.previewLink,
  };
};
