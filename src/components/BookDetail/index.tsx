"use client";
import styles from "./index.module.css";
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

  return (
    <>
      {isLoading && <p className={styles.loading}>読み込み中...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {isNotFound && <p className={styles.notfound}>書籍情報が見つかりませんでした</p>}
      {/* ↓stateが「BookDetail | null」なので、変数にはせずbookを使う前に直接nullチェックする */}
      {!isLoading && !error && book !== null && <BookDetailContent book={book} />}
      <Link href="/" className={styles.link}>
        検索に戻る
      </Link>
    </>
  );
}
