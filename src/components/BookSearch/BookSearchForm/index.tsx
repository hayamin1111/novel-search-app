// "use client";

import styles from "./index.module.css";
import type { SubmitEvent } from "react";
import SearchIcon from "@/components/icons/SearchIcon";

type Props = {
  defaultSearchWord: string;
  onSearch: (searchWord: string) => void;
};

export default function BookSearchForm({ defaultSearchWord, onSearch }: Props) {
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
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} role="search">
      <input
        id="search"
        type="search"
        name="search"
        placeholder="タイトルを入力"
        defaultValue={defaultSearchWord}
        aria-label="書籍タイトルを検索"
        className={styles.searchInput}
      />
      <button type="submit" aria-label="検索" className={styles.submitButton}>
        <SearchIcon className={styles.searchIcon} />
      </button>
    </form>
  );
}
