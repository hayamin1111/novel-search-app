import styles from "./page.module.css";
import BookSearch from "@/components/BookSearch";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.siteTitle}>Book Finder</h1>
        <p className={styles.subTitle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 512 426.99"
            fill="currentColor"
            className={styles.svg}
          >
            <path d="M191.15,393.16c-34.8-13.12-70.79-26.64-112.31-26.64-20.56,0-40.71,3.28-61.35,10v25.84c0,3.6,3.44,6.16,6.88,5.2,62.87-17.76,103.67-23.84,216.54,19.43v-16.88l-6.8-2c-14.24-4.16-28.16-9.44-42.96-14.96Z" />
            <path d="M204.19,84.72v.07c-.05-.03-.1-.05-.16-.07v63.67l-.04,16.92-57.28-15.99v-79.96c-10.56-1.42-21.86-2.32-34.11-2.32-32,0-69.59,5.68-112.55,21.36v200.24l-.05,68.37s.04-.01.05-.02v.17c5.92-2.16,11.76-4.08,17.44-5.68,21.75-6.32,42.15-8.96,61.35-8.96,64.07,0,115.03,28.72,162.06,42.56V105.83s-10.07-8.6-29.3-17.7c-2.35-1.14-4.79-2.28-7.41-3.41Z" />
            <path d="M320.9,393.16c-14.8,5.52-28.71,10.8-42.96,14.96l-6.8,2v16.88c112.87-43.28,153.66-37.2,216.54-19.43,3.44.96,6.88-1.6,6.88-5.2v-25.84c-20.64-6.72-40.79-10-61.35-10-41.51,0-77.51,13.52-112.31,26.64Z" />
            <path d="M399.45,67.03c-83.59,0-128.31,38.8-128.31,38.8v279.25c47.03-13.84,97.99-42.56,162.06-42.56,19.2,0,39.6,2.64,61.35,8.96,4.82,1.36,9.78,2.99,14.78,4.76.84.32,1.66.58,2.5.92v-.05c.05.02.11.04.16.05V88.39c-42.96-15.68-80.55-21.36-112.55-21.36Z" />
            <path d="M204.03,16l-44.93-12.54-12.23-3.46v.05l-.16-.05v69.36c23.35,3.14,42.51,9.1,57.33,15.36V16Z" />
          </svg>
          <em className={styles.catch}>気になる本を探せる書籍検索サービス</em>
        </p>
      </header>
      <main className={styles.content}>
        <p className={styles.lead}>気になる本のタイトルを検索できます。</p>
        <BookSearch />
      </main>
      <footer className={styles.footer}>
        <small className={styles.copyright}>Book Finder&copy;2026hykw</small>
      </footer>
    </div>
  );
}
