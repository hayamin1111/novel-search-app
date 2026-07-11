"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getBookDetail } from "@/lib/googleBooksApi";
import type { BookDetail } from "@/types/book";
import BookDetailContent from "@/components/BookDetail/BookDetailContent";

type Props = {
  id: string;
};

/**
 * データ取得と状態管理担当
 */
export default function BookDetail({ id }: Props) {
  // 状態管理
  const [book, setBook] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const bookDetail = await getBookDetail(id);
        setBook(bookDetail);
      } catch (error) {
        console.error(error);
        setError("書籍情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  const isNotFound = !isLoading && !error && book === null;
  const hasBook = !isLoading && !error && book !== null;

  return (
    <>
      {isLoading && <p>読み込み中...</p>}
      {error && <p>{error}</p>}
      {isNotFound && <p>書籍情報が見つかりませんでした</p>}
      {hasBook && <BookDetailContent book={book} />}
      <Link href="/">検索に戻る</Link>
    </>
  );
}
