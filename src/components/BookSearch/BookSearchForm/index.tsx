// "use client";

import styles from "./index.module.css";
import type { SubmitEvent } from "react";
// import { useRouter } from "next/navigation";
import SearchIcon from "@/components/icons/SearchIcon";

type Props = {
  onSearch: (searchWord: string) => void;
};

export default function BookSearchForm({ onSearch }: Props) {
  // const router = useRouter();
  /**
   * submitを受け取り入力値を親へ渡す
   */
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    // フォーム送信中止
    e.preventDefault();

    // FormDataでvalueを取得
    const form = new FormData(e.currentTarget);
    const value = form.get("search"); //nameがsearchのフィールドを取得

    if (value === null) return;
    const searchWord: string = String(value).trim();

    onSearch(searchWord);

    // URLにクエリ持たせる
    // const params = new URLSearchParams({
    //   q: searchWord,
    // });
    // router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} role="search">
      <input
        id="search"
        type="search"
        name="search"
        placeholder="タイトルを入力"
        aria-label="書籍タイトルを検索"
        className={styles.searchInput}
      />
      <button type="submit" aria-label="検索" className={styles.submitButton}>
        <SearchIcon className={styles.searchIcon} />
      </button>
    </form>
  );
}
