import styles from "./page.module.css";
import BookSearch from "@/components/BookSearch";
import BookOpenIcon from "@/components/icon/BookOpenIcon";

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.siteTitle}>Book Finder</h1>
        <p className={styles.subTitle}>
          <BookOpenIcon className={styles.serviceIcon} />
          <em className={styles.tagline}>気になる本を探せる書籍検索サービス</em>
        </p>
      </header>
      <main>
        <p className={styles.lead}>気になる本のタイトルを検索できます。</p>
        <BookSearch />
      </main>
    </>
  );
}
