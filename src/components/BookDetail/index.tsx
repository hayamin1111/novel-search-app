"use client";
import { useEffect, useState } from "react";
import { getBookDetail } from "@/lib/googleBooksApi";
import type { BookDetail } from "@/types/book";
import styles from "./page.module.css";

type Props = {
  id: string;
};

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

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>書籍情報が見つかりませんでした</p>;

  return (
    <>
      <h1>{book.title}</h1>
      <p>著者：{book.authors.join(", ")}</p>
      <p>出版社：{book.publisher}</p>
      <p>出版日：{book.publishedDate}</p>
      <p>ページ数：{book.pageCount ?? "不明"}</p>
      <p className={styles.description}>{book.description}</p>

      {book.previewLink && (
        <a href={book.previewLink} target="_blank" rel="noreferrer">
          Google Booksで見る
        </a>
      )}
    </>
  );
}
