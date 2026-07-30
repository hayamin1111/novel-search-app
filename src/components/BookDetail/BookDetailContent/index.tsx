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
      <section>
        <div className={styles.detailHeader}>
          <figure className={styles.coverArea}>
            {book.thumbnail ? (
              <Image
                src={book.thumbnail}
                alt={`${book.title}の表紙`}
                width={150}
                height={200}
                className={styles.coverImage}
              />
            ) : (
              <Image
                src="/image/dummy.png"
                alt="表紙なし"
                width={150}
                height={200}
                className={styles.coverImage}
              />
            )}
          </figure>
          <div className={styles.detailContent}>
            <h1 className={styles.detailTitle}>{book.title}</h1>
            <p className={styles.detailAuthors}>{book.authors.join(", ")}</p>
            <dl className={styles.infoList}>
              <div className={styles.infoItem}>
                <dt className={styles.infoLabel}>出版社</dt>
                <dd className={styles.infoValue}>{book.publisher}</dd>
              </div>
              <div className={styles.infoItem}>
                <dt className={styles.infoLabel}>出版日</dt>
                <dd className={styles.infoValue}>{book.publishedDate}</dd>
              </div>
              <div className={styles.infoItem}>
                <dt className={styles.infoLabel}>ページ数</dt>
                <dd className={styles.infoValue}>{book.pageCount ?? "不明"}</dd>
              </div>
            </dl>
            {book.previewLink && (
              <Link
                href={book.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                Google Booksで見る
                <span className={styles.externalLinkIcon} aria-hidden="true">
                  ↗
                </span>
              </Link>
            )}
          </div>
        </div>
        <section className={styles.descriptionSection}>
          <h2 className={styles.descriptionTitle}>あらすじ</h2>
          <p className={styles.descriptionText}>{book.description}</p>
        </section>
      </section>
    </>
  );
}
