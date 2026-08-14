import type { GoogleBooksItem } from "@/types/book";
import { GoogleBooksSearchResponseSchema, GoogleBooksItemSchema } from "@/schemas/books";
import { mapGoogleBooksItemToBook } from "@/lib/googleBooksMapper";
import { NextResponse } from "next/server";

/**
 * Google Books APIで書籍を検索し、Book配列を返す
 * items[]とその中身でZod検証を分けている
 */
export async function GET(request: Request) {
  // URLパラメータを取得
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const startIndexParam = searchParams.get("startIndex") ?? 0;

  // 入力チェック
  if (!q) {
    return NextResponse.json({ message: "クエリパラメータがありません。" }, { status: 400 });
  }

  //環境変数チェック
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "GOOGLE_BOOKS_API_KEY is not set" }, { status: 500 });
  }

  // URL作成
  const queryParams = new URLSearchParams({
    q: `intitle:${q}`,
    printType: "books",
    startIndex: startIndexParam.toString(),
    maxResults: "10",
    key: apiKey,
  });
  const url = `https://www.googleapis.com/books/v1/volumes?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    // HTTPエラーチェック
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Books API error", response.status, errorText);
      return NextResponse.json({ message: "Failed to fetch Google Books API" }, { status: 502 });
    }

    const json = await response.json();

    // Zodでレスポンス全体の検証
    const parsedResponse = GoogleBooksSearchResponseSchema.safeParse(json);
    if (!parsedResponse.success) {
      return NextResponse.json({ message: "Invalid Google Books API response" }, { status: 502 });
    }

    // Zodでitemsを1件ずつ検証
    const items = parsedResponse.data.items ?? [];
    const validItems: GoogleBooksItem[] = [];

    for (const item of items) {
      const parsedItem = GoogleBooksItemSchema.safeParse(item);
      if (!parsedItem.success) {
        continue;
      }
      validItems.push(parsedItem.data);
    }

    // 表示用に変換
    const books = validItems.map(mapGoogleBooksItemToBook);

    return NextResponse.json(books);
  } catch {
    // fetch失敗や想定外例外
    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
