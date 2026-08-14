import { GoogleBooksItemSchema } from "@/schemas/books";
import { mapGoogleBooksItemToBookDetail } from "@/lib/googleBooksMapper";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: Props) {
  // 動的セグメントからID取得
  const { id } = await params;

  // 入力チェック
  if (!id) {
    return NextResponse.json({ message: "idがありません。" }, { status: 400 });
  }

  //環境変数チェック
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "GOOGLE_BOOKS_API_KEY is not set" }, { status: 500 });
  }

  // URL作成
  const queryParams = new URLSearchParams({
    key: apiKey,
  });
  const url = `https://www.googleapis.com/books/v1/volumes/${id}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    // HTTPエラーチェック
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Books API error", response.status, errorText);
      return NextResponse.json({ message: "Failed to fetch Google Books API" }, { status: 502 });
    }

    const json = await response.json();

    // Zodでレスポンスの検証
    const parsedResponse = GoogleBooksItemSchema.safeParse(json);
    if (!parsedResponse.success) {
      return NextResponse.json({ message: "Invalid Google Books API response" }, { status: 502 });
    }

    // 表示用に変換
    const bookDetail = mapGoogleBooksItemToBookDetail(parsedResponse.data);

    return NextResponse.json(bookDetail);
  } catch {
    // fetch失敗や想定外例外
    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
