// import { useReducer } from "react";
import type { Book } from "@/types/book";
import type { SearchSnapshot } from "@/types/searchSnapshot";
import { mergeUniqueBooks } from "@/lib/books";

// isLoading. hasSearched, error を1つにまとめる
type SearchRequest =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

// isLoadingMore, loadMoreError を1つにまとめる
type LoadMoreRequest =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string };

export type SearchAction =
  | { type: "SEARCH_STARTED"; submittedSearchWord: string }
  | { type: "SEARCH_SUCCEEDED"; books: Book[]; hasMore: boolean }
  | { type: "SEARCH_FAILED"; message: string }
  | { type: "LOAD_MORE_STARTED" }
  | { type: "LOAD_MORE_SUCCEEDED"; books: Book[]; hasMore: boolean }
  | { type: "LOAD_MORE_FAILED"; message: string }
  | { type: "SNAPSHOT_RESTORED"; snapshot: SearchSnapshot }
  | { type: "RESET" };

export type SearchState = {
  books: Book[];
  submittedSearchWord: string;
  nextStartIndex: number;
  hasMore: boolean;
  searchRequest: SearchRequest;
  loadMoreRequest: LoadMoreRequest;
};

export const initialSearchState: SearchState = {
  books: [],
  submittedSearchWord: "",
  nextStartIndex: 0,
  hasMore: false,
  searchRequest: { status: "idle" },
  loadMoreRequest: { status: "idle" },
};

export const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case "SEARCH_STARTED": {
      return {
        ...state,
        books: [],
        submittedSearchWord: action.submittedSearchWord,
        nextStartIndex: 0,
        hasMore: false,
        searchRequest: { status: "loading" },
        loadMoreRequest: { status: "idle" },
      };
    }
    case "SEARCH_SUCCEEDED": {
      return {
        ...state,
        books: action.books,
        nextStartIndex: 10,
        hasMore: action.hasMore,
        searchRequest: { status: "success" },
        loadMoreRequest: { status: "idle" },
      };
    }
    case "SEARCH_FAILED": {
      return {
        ...state,
        books: [],
        searchRequest: {
          status: "error",
          message: action.message,
        },
        loadMoreRequest: { status: "idle" },
      };
    }
    case "LOAD_MORE_STARTED": {
      return {
        ...state,
        loadMoreRequest: { status: "loading" },
      };
    }
    case "LOAD_MORE_SUCCEEDED": {
      const existingBooks = state.books;
      const incomingBooks = action.books;
      return {
        ...state,
        books: mergeUniqueBooks(existingBooks, incomingBooks),
        nextStartIndex: state.nextStartIndex + 10, // 次回の追加取得開始位置を10件分進める
        hasMore: action.hasMore,
        loadMoreRequest: { status: "idle" },
      };
    }
    case "LOAD_MORE_FAILED": {
      return {
        ...state,
        loadMoreRequest: {
          status: "error",
          message: action.message,
        },
      };
    }
    case "SNAPSHOT_RESTORED": {
      return {
        ...initialSearchState,
        books: action.snapshot.books,
        submittedSearchWord: action.snapshot.query,
        nextStartIndex: action.snapshot.nextStartIndex,
        hasMore: action.snapshot.hasMore,
        searchRequest: { status: "success" },
        loadMoreRequest: { status: "idle" },
      };
    }
    case "RESET":
      return initialSearchState;
    default:
      return state;
  }
};

// TODO: Zodで不正な書籍を除外するとbooks.lengthが10未満になるため、hasMoreの判定方法は後で改善する
// dispatch({
//   type: "SEARCH_STARTED",
//   searchWord,
// });
// dispatch({
//   type: "SEARCH_SUCCEEDED",
//   searchWord,
// });
