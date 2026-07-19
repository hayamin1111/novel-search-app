import styles from "./index.module.css";
import type { SubmitEvent } from "react";

type Props = {
  onSearch: (searchWord: string) => void;
};

export default function BookSearchForm({ onSearch }: Props) {
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
        aria-label="書籍タイトルを検索"
        className={styles.input}
      />
      <button type="submit" aria-label="検索" className={styles.button}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 512 512"
          fill="currentColor"
          className={styles.svg}
        >
          <path
            d="M449.803,62.197C408.443,20.807,353.85-0.037,299.646-0.006C245.428-0.037,190.85,20.807,149.49,62.197
            C108.1,103.557,87.24,158.15,87.303,212.338c-0.047,37.859,10.359,75.766,30.547,109.359L15.021,424.525
            c-20.016,20.016-20.016,52.453,0,72.469c20,20.016,52.453,20.016,72.453,0L190.318,394.15
            c33.578,20.203,71.5,30.594,109.328,30.547c54.203,0.047,108.797-20.797,150.156-62.188
            c41.375-41.359,62.234-95.938,62.188-150.172C512.053,158.15,491.178,103.557,449.803,62.197z M391.818,304.541
            c-25.547,25.531-58.672,38.125-92.172,38.188c-33.5-0.063-66.609-12.656-92.188-38.188c-25.531-25.578-38.125-58.688-38.188-92.203
            c0.063-33.484,12.656-66.609,38.188-92.172c25.578-25.531,58.688-38.125,92.188-38.188c33.5,0.063,66.625,12.656,92.188,38.188
            c25.531,25.563,38.125,58.688,38.188,92.172C429.959,245.854,417.365,278.963,391.818,304.541z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
    </form>
  );
}
