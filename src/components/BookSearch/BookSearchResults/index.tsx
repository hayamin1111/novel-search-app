import styles from "./index.module.css";
import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types/book";

type Props = {
  books: Book[];
};

export default function BookSearchResults({ books }: Props) {
  return (
    <div className={styles.cardList}>
      {books.map((book) => (
        <article key={book.id} className={styles.card}>
          <h2 className={styles.title}>{book.title}</h2>
          <p className={styles.authors}>{book.authors.join(", ")}</p>
          <p className={styles.publishedDate}>{book.publishedDate}</p>
          <figure className={styles.image}>
            {book.thumbnail ? (
              <Image src={book.thumbnail} alt={`${book.title}の表紙`} width={150} height={200} />
            ) : (
              <Image src="/image/dummy.png" alt="表紙なし" width={150} height={200} />
            )}
          </figure>
          <Link href={`/books/${book.id}`} className={styles.link}>
            詳細を見る
          </Link>
        </article>
      ))}
    </div>
  );
}
