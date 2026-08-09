import styles from "./page.module.css";
import BookSearch from "@/components/BookSearch";
import BookOpenIcon from "@/components/icons/BookOpenIcon";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.siteTitle}>Book Finder</h1>
        <p className={styles.subTitle}>
          <BookOpenIcon className={styles.serviceIcon} />
          <em className={styles.tagline}>書籍検索サービス</em>
        </p>
      </header>
      <main>
        <p className={styles.lead}>気になる本をタイトルから検索できます。</p>
        {/* Suspense:useSearchParamsがブラウザ側でURLを読める状態になるまで、BookSearchのレンダーを保留する */}
        <Suspense fallback={null}>
          <BookSearch />
        </Suspense>
      </main>
    </>
  );
}
