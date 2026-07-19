import styles from "./index.module.css";
import Image from "next/image";
import Link from "next/link";
import type { BookDetail } from "@/types/book";

type Props = {
  book: BookDetail;
};

/**
 * 書籍情報の表示担当
 */
export default function BookDetailContent({ book }: Props) {
  return (
    <>
      <h1 className={styles.title}>{book.title}</h1>
      <figure className={styles.image}>
        {book.thumbnail ? (
          <Image src={book.thumbnail} alt={`${book.title}の表紙`} width={150} height={200} />
        ) : (
          <Image src="/image/dummy.png" alt="表紙なし" width={150} height={200} />
        )}
      </figure>
      <p className={styles.authors}>著者：{book.authors.join(", ")}</p>
      <p className={styles.publisher}>出版社：{book.publisher}</p>
      <p className={styles.publishedDate}>出版日：{book.publishedDate}</p>
      <p className={styles.pageCount}>ページ数：{book.pageCount ?? "不明"}</p>
      <p className={styles.description}>{book.description}</p>
      {book.previewLink && (
        <Link
          href={book.previewLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Google Booksで見る
        </Link>
      )}
    </>
  );
}
