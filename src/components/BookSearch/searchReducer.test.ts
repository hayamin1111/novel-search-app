import { expect, describe, test } from "vitest";
import type { Book } from "@/types/book";
import type { SearchSnapshot } from "@/types/searchSnapshot";
import type { SearchState, SearchAction } from "./searchReducer";
import { searchReducer } from "./searchReducer";

// Arrange: テスト用データ
const bookFixtures = [
  {
    id: "book-1",
    title: "既存の書籍1",
    authors: ["著者A"],
    publishedDate: "2024-01-01",
    thumbnail: "https://example.com/book-1.jpg",
  },
  {
    id: "book-2",
    title: "既存の書籍2",
    authors: ["著者B"],
    publishedDate: "2024-02-01",
    thumbnail: "https://example.com/book-2.jpg",
  },
  {
    id: "book-3",
    title: "追加の書籍3",
    authors: ["著者C"],
    publishedDate: "2024-03-01",
    thumbnail: "https://example.com/book-3.jpg",
  },
] satisfies Book[];
const idleState = {
  books: [],
  submittedSearchWord: "",
  nextStartIndex: 0,
  hasMore: false,
  searchRequest: { status: "idle" },
  loadMoreRequest: { status: "idle" },
} satisfies SearchState;
const searchingState = {
  books: [],
  submittedSearchWord: "React",
  nextStartIndex: 0,
  hasMore: false,
  searchRequest: { status: "loading" },
  loadMoreRequest: { status: "idle" },
} satisfies SearchState;
const successState = {
  books: [bookFixtures[0], bookFixtures[1]],
  submittedSearchWord: "React",
  nextStartIndex: 10,
  hasMore: true,
  searchRequest: { status: "success" },
  loadMoreRequest: { status: "idle" },
} satisfies SearchState;
const searchErrorState = {
  books: [],
  submittedSearchWord: "React",
  nextStartIndex: 0,
  hasMore: false,
  searchRequest: {
    status: "error",
    message: "書籍情報の取得に失敗しました。",
  },
  loadMoreRequest: { status: "idle" },
} satisfies SearchState;
const loadMoreLoadingState = {
  ...successState,
  loadMoreRequest: { status: "loading" },
} satisfies SearchState;
const loadMoreErrorState = {
  ...successState,
  loadMoreRequest: {
    status: "error",
    message: "追加の書籍情報の取得に失敗しました。",
  },
} satisfies SearchState;
const searchSnapshotFixture = {
  query: "TypeScript",
  books: [bookFixtures[0], bookFixtures[2]],
  nextStartIndex: 20,
  hasMore: true,
  scrollY: 3200,
  savedAt: 1700000000000,
} satisfies SearchSnapshot;

describe("searchReducer", () => {
  test("SEARCH_STARTED で検索開始状態に更新できる", () => {
    // Arrange: テスト用データ
    const previousState = successState;
    const action = { type: "SEARCH_STARTED", submittedSearchWord: "React" } satisfies SearchAction;

    // Act: テスト対象を実行
    const nextState = searchReducer(previousState, action);

    // Assert: 結果を確認
    expect(nextState).toEqual({
      books: [],
      submittedSearchWord: "React",
      nextStartIndex: 0,
      hasMore: false,
      searchRequest: { status: "loading" },
      loadMoreRequest: { status: "idle" },
    });
  });

  test("SEARCH_STARTED で前回の検索エラーを解除して再検索を開始できる", () => {
    // Arrange: テスト用データ
    const previousState = searchErrorState;
    const action = { type: "SEARCH_STARTED", submittedSearchWord: "React" } satisfies SearchAction;

    // Act: テスト対象を実行
    const nextState = searchReducer(previousState, action);

    // Assert: 結果を確認
    expect(nextState).toEqual({
      books: [],
      submittedSearchWord: "React",
      nextStartIndex: 0,
      hasMore: false,
      searchRequest: { status: "loading" },
      loadMoreRequest: { status: "idle" },
    });
  });

  test("SEARCH_SUCCEEDED で正しく更新できる", () => {
    // Arrange: テスト用データ
    const previousState = searchingState;
    const action = {
      type: "SEARCH_SUCCEEDED",
      books: bookFixtures,
      hasMore: true,
    } satisfies SearchAction;

    // Act: テスト対象を実行
    const nextState = searchReducer(previousState, action);

    // Assert: 結果を確認
    expect(nextState).toEqual({
      books: bookFixtures,
      submittedSearchWord: "React",
      nextStartIndex: 10,
      hasMore: true,
      searchRequest: { status: "success" },
      loadMoreRequest: { status: "idle" },
    });
  });

  test("SEARCH_FAILED でロードを終えてエラーが出る", () => {
    // Arrange: テスト用データ
    const previousState = searchingState;
    const action = {
      type: "SEARCH_FAILED",
      message: "書籍情報の取得に失敗しました。",
    } satisfies SearchAction;

    // Act: テスト対象を実行
    const nextState = searchReducer(previousState, action);

    // Assert: 結果を確認
    expect(nextState).toEqual({
      books: [],
      submittedSearchWord: "React",
      nextStartIndex: 0,
      hasMore: false,
      searchRequest: { status: "error", message: "書籍情報の取得に失敗しました。" },
      loadMoreRequest: { status: "idle" },
    });
  });

  test("LOAD_MORE_STARTED で追加検索開始状態に更新できる", () => {
    // Arrange: テスト用データ
    const previousState = successState;
    const action = {
      type: "LOAD_MORE_STARTED",
    } satisfies SearchAction;

    // Act: テスト対象を実行
    const nextState = searchReducer(previousState, action);

    // Assert: 結果を確認
    expect(nextState).toEqual({
      books: [bookFixtures[0], bookFixtures[1]],
      submittedSearchWord: "React",
      nextStartIndex: 10,
      hasMore: true,
      searchRequest: { status: "success" },
      loadMoreRequest: { status: "loading" },
    });
  });

  test("LOAD_MORE_STARTED で前回の追加取得エラーを解除して再取得を開始できる", () => {
    // Arrange: テスト用データ
    const previousState = loadMoreErrorState;
    const action = {
      type: "LOAD_MORE_STARTED",
    } satisfies SearchAction;

    // Act: テスト対象を実行
    const nextState = searchReducer(previousState, action);

    // Assert: 結果を確認
    expect(nextState).toEqual({
      books: [bookFixtures[0], bookFixtures[1]],
      submittedSearchWord: "React",
      nextStartIndex: 10,
      hasMore: true,
      searchRequest: { status: "success" },
      loadMoreRequest: { status: "loading" },
    });
  });

  test("LOAD_MORE_SUCCEEDED で追加取得を完了できる", () => {
    // Arrange: テスト用データ
    const previousState = loadMoreLoadingState;
    const action = {
      type: "LOAD_MORE_SUCCEEDED",
      books: [bookFixtures[2]],
      hasMore: true,
    } satisfies SearchAction;

    // Act: テスト対象を実行
    const nextState = searchReducer(previousState, action);

    // Assert: 結果を確認
    expect(nextState).toEqual({
      books: [bookFixtures[0], bookFixtures[1], bookFixtures[2]],
      submittedSearchWord: "React",
      nextStartIndex: 20,
      hasMore: true,
      searchRequest: { status: "success" },
      loadMoreRequest: { status: "idle" },
    });
  });

  test("LOAD_MORE_FAILED でエラーになる", () => {
    // Arrange: テスト用データ
    const previousState = loadMoreLoadingState;
    const action = {
      type: "LOAD_MORE_FAILED",
      message: "追加の書籍情報の取得に失敗しました。",
    } satisfies SearchAction;

    // Act: テスト対象を実行
    const nextState = searchReducer(previousState, action);

    // Assert: 結果を確認
    expect(nextState).toEqual({
      books: [bookFixtures[0], bookFixtures[1]],
      submittedSearchWord: "React",
      nextStartIndex: 10,
      hasMore: true,
      searchRequest: { status: "success" },
      loadMoreRequest: { status: "error", message: "追加の書籍情報の取得に失敗しました。" },
    });
  });

  test("SNAPSHOT_RESTORED でstateを復元できる", () => {
    // Arrange: テスト用データ
    const previousState = successState;
    const action = {
      type: "SNAPSHOT_RESTORED",
      snapshot: searchSnapshotFixture,
    } satisfies SearchAction;

    // Act: テスト対象を実行
    const nextState = searchReducer(previousState, action);

    // Assert: 結果を確認
    expect(nextState).toEqual({
      books: searchSnapshotFixture.books,
      submittedSearchWord: searchSnapshotFixture.query,
      nextStartIndex: searchSnapshotFixture.nextStartIndex,
      hasMore: searchSnapshotFixture.hasMore,
      searchRequest: { status: "success" },
      loadMoreRequest: { status: "idle" },
    });
  });

  test("RESET で初期化できる", () => {
    // Arrange: テスト用データ
    const previousState = successState;
    const action = {
      type: "RESET",
    } satisfies SearchAction;

    // Act: テスト対象を実行
    const nextState = searchReducer(previousState, action);

    // Assert: 結果を確認
    expect(nextState).toEqual(idleState);
  });
});
