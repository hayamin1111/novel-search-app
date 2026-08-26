// @vitest-environment jsdom
import { beforeEach, expect, describe, test } from "vitest";
import type { SearchSnapshot } from "@/types/searchSnapshot";
import { getSearchSnapshot, saveSearchSnapshot } from "./searchSnapshot";

// Arrange: テスト用データ
const CURRENT_TIME = 1_800_000_000_000;
const SEARCH_SNAPSHOT_KEY = "bookSearchSnapshot";
const searchSnapshotFixture = {
  query: "TypeScript",
  books: [
    {
      id: "book-1",
      title: "TypeScript入門",
      authors: ["テスト著者A"],
      publishedDate: "2026-01-01",
      thumbnail: "https://example.com/book-1.jpg",
    },
    {
      id: "book-2",
      title: "実践TypeScript",
      authors: ["テスト著者B"],
      publishedDate: "2026-02-01",
    },
  ],
  nextStartIndex: 20,
  hasMore: true,
  scrollY: 1200,
  savedAt: CURRENT_TIME - 5 * 60 * 1000,
} satisfies SearchSnapshot;

describe("saveSearchSnapshot", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("saveSearchSnapshotでJSON文字列として保存できる", () => {
    // Act: テスト対象を実行
    saveSearchSnapshot(searchSnapshotFixture);
    // Assert: 結果を確認
    expect(sessionStorage.getItem(SEARCH_SNAPSHOT_KEY)).toEqual(
      JSON.stringify(searchSnapshotFixture),
    );
  });
});

describe("getSearchSnapshot", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("保存データがない場合はundefinedを返す", () => {
    // Act: テスト対象を実行
    const result = getSearchSnapshot("React");
    // Assert: 結果を確認
    expect(result).toBeUndefined();
  });

  test("queryが不一致ならundefinedを返してstorageから削除する", () => {
    // Act: テスト対象を実行
    const result = getSearchSnapshot("jQuery");
    // Assert: 結果を確認
    expect(result).toBeUndefined();
  });

  // test("queryが不一致ならundefinedを返してstorageから削除する", () => {
  //   // Act: テスト対象を実行
  //   // Assert: 結果を確認
  // });

  // test("queryが不一致ならundefinedを返してstorageから削除する", () => {
  //   // Act: テスト対象を実行
  //   // Assert: 結果を確認
  // });

  // queryが不一致ならundefinedを返してstorageから削除する
  // 10分以上経過していたらundefinedを返して削除する
  // JSONが壊れていたらundefinedを返して削除する
  // Zod検証に失敗したらundefinedを返して削除する
  // clearSearchSnapshotで削除できる
});

// describe("clearSearchSnapshot", () => {
//   beforeEach(() => {
//     sessionStorage.clear();
//   });

//   // clearSearchSnapshotで削除できる
// });
