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
          <figure className={styles.imageWrapper}>
            {book.thumbnail ? (
              <Image
                src={book.thumbnail}
                alt=""
                width={150}
                height={200}
                className={styles.image}
              />
            ) : (
              <Image
                src="/image/dummy.png"
                alt="表紙なし"
                width={150}
                height={200}
                className={styles.image}
              />
            )}
          </figure>
          <div className={styles.body}>
            <h2 className={styles.title}>{book.title}</h2>
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" className={styles.icon}>
                    <path
                      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.87 0-7 1.79-7 4v1h14v-1c0-2.21-3.13-4-7-4Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className={styles.infoText}>{book.authors.join(", ")}</span>
              </li>
              <li className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" className={styles.icon}>
                    <path
                      d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm12 8H5v8h14Zm-3-4H8v1a1 1 0 1 1-2 0V6H5v2h14V6h-1v1a1 1 0 1 1-2 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className={styles.infoText}>{book.publishedDate}</span>
              </li>
            </ul>
            <Link href={`/books/${book.id}`} className={styles.link}>
              詳細を見る <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
