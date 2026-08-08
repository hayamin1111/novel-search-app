"use client";
import styles from "./index.module.css";
import stylesFeedback from "@/styles/feedback.module.css";
import { useState } from "react";
import type { Book } from "@/types/book";
import { searchBooks } from "@/lib/googleBooksApi";
import BookSearchForm from "@/components/BookSearch/BookSearchForm";
import BookSearchResults from "@/components/BookSearch/BookSearchResults";
import SearchIcon from "@/components/icons/SearchIcon";
import BookOpenIcon from "@/components/icons/BookOpenIcon";
import LoadingIcon from "@/components/icons/LoadingIcon";
import ErrorIcon from "@/components/icons/ErrorIcon";
// import { useSearchParams } from "next/navigation";

export default function BookSearch() {
  // 状態管理
  const [isLoading, setIsLoading] = useState(false); //検索中ローディング
  const [hasSearched, setHasSearched] = useState(false); //未検索かどうか
  const [error, setError] = useState<string | null>(null); //初回検索・検索全体のエラー
  const [books, setBooks] = useState<Book[]>([]); //書籍情報
  const [submittedSearchWord, setSubmittedSearchWord] = useState(""); //「さらに見る」用に検索ワードを保存
  const [nextStartIndex, setNextStartIndex] = useState(0); //「さらに見る」用のパラメータ
  const [hasMore, setHasMore] = useState(false); //「さらに見る」用
  const [isLoadingMore, setIsLoadingMore] = useState(false); //「さらに見る」用ローディング
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null); //「さらに見る」の追加取得エラー

  /**
   * 通常の検索
   */
  const handleSearch = async (searchWord: string) => {
    // 空文字処理
    if (searchWord === "") {
      setBooks([]);
      setHasSearched(false);
      setError(null);
      setSubmittedSearchWord("");
      setNextStartIndex(0);
      setHasMore(false);
      setIsLoadingMore(false);
      setLoadMoreError(null);
      return;
    }

    // 初期化
    setIsLoading(true);
    setBooks([]); //前回検索結果は削除
    setError(null); //前回のエラー表示は削除
    setLoadMoreError(null);
    setNextStartIndex(0);
    setHasMore(false);
    setIsLoadingMore(false);
    setLoadMoreError(null);

    setSubmittedSearchWord(searchWord);

    try {
      // 文字列検索
      const books = await searchBooks(searchWord);
      setBooks(books);
      setHasSearched(true);
      setNextStartIndex(10);
      setHasMore(books.length === 10);
    } catch (error) {
      setBooks([]);
      setHasSearched(true);
      console.error(error);
      setError("書籍情報の取得に失敗しました。時間をおいて再度お試しください。");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 「さらに見る」用の検索
   */
  const handleSearchMore = async () => {
    if (submittedSearchWord === "" || !hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    let newBooks: Book[] = [];

    try {
      newBooks = await searchBooks(submittedSearchWord, nextStartIndex); //startIndexパラメータを追加して再検索

      //書籍の重複防止
      setBooks((prevBooks) => {
        const existingBookIds = new Set(prevBooks.map((book) => book.id));

        const uniqueBooks = newBooks.filter((book) => {
          if (existingBookIds.has(book.id)) {
            return false;
          }

          existingBookIds.add(book.id);
          return true;
        });

        return [...prevBooks, ...uniqueBooks]; //既存結果の末尾に追加
      });

      setNextStartIndex((prev) => prev + 10); // 次回の追加取得開始位置を10件分進める
      setHasMore(newBooks.length === 10);
      setHasSearched(true);
    } catch (error) {
      console.error(error);
      setLoadMoreError("追加の書籍情報の取得に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsLoadingMore(false);
    }
  };

  /**
   * URLのクエリを取得する
   */
  // const searchParams = useSearchParams();
  // const query = searchParams.get("q")?.trim() ?? "";
  // useEffect(() => {
  //   if (!query) return;
  //   handleSearch(query);
  // }, [query]);

  const isInitial = !isLoading && !hasSearched && !error;
  const isEmpty = !isLoading && hasSearched && books.length === 0 && !error;
  const hasResults = books.length > 0;

  return (
    <>
      <div className={styles.searchPanel}>
        <div className={styles.searchFormArea}>
          <BookSearchForm onSearch={handleSearch} />
          {error && (
            <div className={stylesFeedback.error}>
              <ErrorIcon className={stylesFeedback.errorIcon} />
              <p className={stylesFeedback.errorText}>{error}</p>
            </div>
          )}
        </div>
        <div className={styles.searchResultArea} aria-live="polite" aria-atomic="true">
          {isInitial && (
            <div className={styles.resultStatus}>
              <SearchIcon className={styles.resultStatusIcon} />
              <p className={styles.resultStatusText}>タイトルを入力して本を探してみましょう。</p>
            </div>
          )}
          {isLoading && (
            <div className={styles.resultStatus}>
              <LoadingIcon className={styles.resultStatusIcon} />
              <p className={styles.resultStatusText}>検索中...</p>
            </div>
          )}
          {isEmpty && (
            <div className={styles.resultStatus}>
              <BookOpenIcon className={styles.resultStatusIcon} />
              <p className={styles.resultStatusText}>該当する書籍が見つかりませんでした。</p>
            </div>
          )}

          {hasResults && <BookSearchResults books={books} />}
        </div>
        {hasMore && (
          <div className={styles.loadMoreArea}>
            <button
              type="button"
              onClick={handleSearchMore}
              disabled={isLoadingMore}
              className={styles.loadMoreButton}
            >
              {isLoadingMore ? (
                <>
                  <LoadingIcon className={styles.loadMoreIcon} />
                  <span>追加読み込み中...</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">＋</span>
                  <span>さらに見る</span>
                </>
              )}
            </button>
          </div>
        )}
        {loadMoreError && (
          <div className={stylesFeedback.error}>
            <ErrorIcon className={stylesFeedback.errorIcon} />
            <p className={stylesFeedback.errorText}>{loadMoreError}</p>
          </div>
        )}
      </div>
    </>
  );
}
