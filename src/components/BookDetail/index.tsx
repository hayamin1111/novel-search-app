"use client";
import styles from "./index.module.css";
import linkStyles from "@/styles/link.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getBookDetail } from "@/lib/googleBooksApi";
import type { BookDetail } from "@/types/book";
import BookDetailContent from "@/components/BookDetail/BookDetailContent";
import LoadingIcon from "@/components/icons/LoadingIcon";

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
      <main className={styles.detailPage}>
        <div className={styles.detailContainer}>
          {isLoading && (
            <div className={styles.detailStatus}>
              <LoadingIcon className={styles.detailStatusIcon} />
              <p className={styles.detailStatusText}>読み込み中...</p>
            </div>
          )}
          {error && <p className={styles.detailError}>{error}</p>}
          {isNotFound && <p className={styles.detailNotFound}>書籍情報が見つかりませんでした</p>}
          {/* ↓stateが「BookDetail | null」なので、変数にはせずbookを使う前に直接nullチェックする */}
          {!isLoading && !error && book !== null && <BookDetailContent book={book} />}
        </div>
        <div className={linkStyles.backLinkArea}>
          <Link href="/" className={linkStyles.backLink}>
            <span aria-hidden="true">←</span>
            検索結果に戻る
          </Link>
        </div>
      </main>
    </>
  );
}
