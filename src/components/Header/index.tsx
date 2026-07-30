import Link from "next/link";
import styles from "./index.module.css";
export default function Header() {
  return (
    <>
      <header>
        <div className={styles.headerLogoArea}>
          <Link href="/" className={styles.headerLogo}>
            Book Finder
          </Link>
        </div>
      </header>
    </>
  );
}
