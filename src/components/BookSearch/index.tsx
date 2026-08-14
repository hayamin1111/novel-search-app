"use client";
import styles from "./index.module.css";
import feedbackStyles from "@/styles/feedback.module.css";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { SearchSnapshot } from "@/types/searchSnapshot";
import { initialSearchState, searchReducer } from "@/components/BookSearch/searchReducer";
import BookSearchForm from "@/components/BookSearch/BookSearchForm";
import BookSearchResults from "@/components/BookSearch/BookSearchResults";
import SearchIcon from "@/components/icons/SearchIcon";
import BookOpenIcon from "@/components/icons/BookOpenIcon";
import LoadingIcon from "@/components/icons/LoadingIcon";
import ErrorIcon from "@/components/icons/ErrorIcon";
import { getSearchSnapshot, saveSearchSnapshot, clearSearchSnapshot } from "@/lib/searchSnapshot";
import { searchBooks } from "@/lib/googleBooksApi";

export default function BookSearch() {
  // 状態管理
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);
  const { books, submittedSearchWord, nextStartIndex, hasMore, searchRequest, loadMoreRequest } =
    state;
  //表示用booleanをstateから導出する
  const isLoading = searchRequest.status === "loading";
  const isLoadingMore = loadMoreRequest.status === "loading";
  const error = searchRequest.status === "error" ? searchRequest.message : null;
  const loadMoreError = loadMoreRequest.status === "error" ? loadMoreRequest.message : null;

  const restoreScrollYRef = useRef<number | null>(null);

  const searchParams = useSearchParams();
  const defaultSearchWord = searchParams.get("q")?.trim() ?? "";

  /**
   * 通常の検索
   */
  const handleSearch = (searchWord: string) => {
    // 検索ワードをクエリパラメータとして設定
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("q", searchWord);

    // 空文字処理
    if (searchWord === "") {
      // クエリの削除
      searchParams.delete("q");
      const queryString = searchParams.toString();
      const url = queryString ? `/?${queryString}` : window.location.pathname;
      window.history.replaceState(null, "", url);

      dispatch({ type: "RESET" });

      clearSearchSnapshot();

      return;
    }

    // 検索実行
    executeSearch(searchWord);

    // URLのクエリを設定
    window.history.replaceState(null, "", `/?${searchParams.toString()}`);
  };

  /**
   * 検索実行
   */
  const executeSearch = async (searchWord: string) => {
    dispatch({
      type: "SEARCH_STARTED",
      submittedSearchWord: searchWord,
    });

    try {
      // 文字列検索
      const books = await searchBooks(searchWord);
      dispatch({
        type: "SEARCH_SUCCEEDED",
        books,
        hasMore: books.length === 10, // TODO: Zodで不正な書籍を除外するとbooks.lengthが10未満になるため、hasMoreの判定方法は後で改善する
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "SEARCH_FAILED",
        message: "書籍情報の取得に失敗しました。時間をおいて再度お試しください。",
      });
    }
  };

  /**
   * 「さらに見る」用の検索
   */
  const handleSearchMore = async () => {
    if (submittedSearchWord === "" || !hasMore || isLoadingMore) return;

    dispatch({
      type: "LOAD_MORE_STARTED",
    });

    try {
      const incomingBooks = await searchBooks(submittedSearchWord, nextStartIndex); //startIndexパラメータを追加して再検索

      dispatch({
        type: "LOAD_MORE_SUCCEEDED",
        books: incomingBooks,
        hasMore: incomingBooks.length === 10, // TODO: Zodで不正な書籍を除外するとbooks.lengthが10未満になるため、hasMoreの判定方法は後で改善する
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "LOAD_MORE_FAILED",
        message: "追加の書籍情報の取得に失敗しました。時間をおいて再度お試しください。",
      });
    }
  };

  /**
   * snapshotをsessionStorageに保存するハンドラ
   */
  const handleNavigateToDetail = () => {
    const snapshot: SearchSnapshot = {
      query: submittedSearchWord,
      books,
      nextStartIndex,
      hasMore,
      scrollY: window.scrollY,
      savedAt: Date.now(),
    };

    saveSearchSnapshot(snapshot);
  };

  /**
   * 初回の初期化処理
   */
  useEffect(() => {
    // パラメータをURLから取得
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("q")?.trim() ?? "";

    if (!query) return;

    const snapshot = getSearchSnapshot(query);

    if (snapshot) {
      restoreScrollYRef.current = snapshot.scrollY; //ブラウザバックでスクロール位置を復元

      dispatch({
        type: "SNAPSHOT_RESTORED",
        snapshot,
      });
      return;
    }

    //クエリで再検索（詳細ページからのブラウザバック対応）
    void executeSearch(query); //戻り値をundefinedにするためのvoid
  }, []);

  useLayoutEffect(() => {
    const scrollY = restoreScrollYRef.current;
    if (books.length === 0 || scrollY === null) return;

    window.scrollTo({
      top: scrollY,
      behavior: "auto",
    });

    restoreScrollYRef.current = null; //スクロール復元は一度だけ実行のためnullに戻す
  }, [books.length]);

  const isInitial = searchRequest.status === "idle";
  const isEmpty = searchRequest.status === "success" && books.length === 0;
  const hasResults = searchRequest.status === "success" && books.length > 0;

  // 読み上げ用
  let statusMessage = "";
  if (isLoading) {
    statusMessage = "検索中です";
  } else if (isLoadingMore) {
    statusMessage = "追加の書籍を読み込んでいます";
  } else if (loadMoreError) {
    statusMessage = loadMoreError;
  } else if (isEmpty) {
    statusMessage = "該当する書籍が見つかりませんでした";
  } else if (hasResults) {
    statusMessage = `${books.length}件の検索結果を表示しました`;
  }

  return (
    <>
      <div className={styles.searchPanel}>
        <div className={styles.searchFormArea}>
          <BookSearchForm onSearch={handleSearch} defaultSearchWord={defaultSearchWord} />
          {error && (
            <div className={feedbackStyles.error} role="alert">
              <ErrorIcon className={feedbackStyles.errorIcon} />
              <p className={feedbackStyles.errorText}>{error}</p>
            </div>
          )}
        </div>
        <div>
          <div>
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
          </div>
          <div>
            {hasResults && (
              <>
                <BookSearchResults
                  books={books}
                  searchWord={submittedSearchWord}
                  onNavigateToDetail={handleNavigateToDetail}
                />
              </>
            )}
            <p className={feedbackStyles.visuallyHidden} role="status">
              {statusMessage}
            </p>
          </div>
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
          <div className={feedbackStyles.error}>
            <ErrorIcon className={feedbackStyles.errorIcon} />
            <p className={feedbackStyles.errorText}>{loadMoreError}</p>
          </div>
        )}
      </div>
    </>
  );
}
