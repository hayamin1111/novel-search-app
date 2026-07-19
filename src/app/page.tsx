import styles from "./page.module.css";
import BookSearch from "@/components/BookSearch";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.siteTitle}>Book Finder</h1>
        <em className={styles.subTitle}>気になる本を探せる書籍検索サービス</em>
      </header>
      <main className={styles.content}>
        <p className={styles.text}>気になる本のタイトルを検索できます。</p>
        <BookSearch />
      </main>
      <footer className={styles.footer}>
        <small className={styles.copyright}>書籍検索&copy;2026hykw</small>
      </footer>
    </div>
  );
}
