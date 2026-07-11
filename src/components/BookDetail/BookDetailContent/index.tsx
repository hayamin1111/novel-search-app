import Image from "next/image";
import type { BookDetail } from "@/types/book";
import styles from "./page.module.css";

type Props = {
  book: BookDetail;
};

/**
 * 書籍情報の表示担当
 */
export default function BookDetailContent({ book }: Props) {
  return (
    <>
      <h1>{book.title}</h1>
      {book.thumbnail ? (
        <Image src={book.thumbnail} alt={`${book.title}の表紙`} width={150} height={200} />
      ) : (
        <Image src="/image/dummy.png" alt="表紙なし" width={150} height={200} />
      )}
      <p>著者：{book.authors.join(", ")}</p>
      <p>出版社：{book.publisher}</p>
      <p>出版日：{book.publishedDate}</p>
      <p>ページ数：{book.pageCount ?? "不明"}</p>
      <p className={styles.description}>{book.description}</p>
      {book.previewLink && (
        <a href={book.previewLink} target="_blank" rel="noopener noreferrer">
          Google Booksで見る
        </a>
      )}
    </>
  );
}
