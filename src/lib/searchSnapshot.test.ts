// // @vitest-environment jsdom
// import { expect, describe, test } from "vitest";
// import type { SearchSnapshot } from "@/types/searchSnapshot";
// import { getSearchSnapshot, saveSearchSnapshot } from "./searchSnapshot";

// // Arrange: テスト用データ

// describe("getSearchSnapshot", () => {
//   test("", () => {
//     // Act: テスト対象を実行
//     // const result = mapGoogleBooksItemToBook(googleBooksItemFixture);
//     // // Assert: 結果を確認
//     // expect(result).toEqual({
//     //   id: "test-book-1",
//     //   title: "テスト用書籍タイトル",
//     //   authors: ["著者A", "著者B"],
//     //   publishedDate: "2024-05-20",
//     //   thumbnail: "https://example.com/test-thumbnail.jpg",
//     // });
//   });
//   // saveSearchSnapshotでJSON文字列として保存できる
//   // 保存データがない場合はundefinedを返す
//   // queryが一致し、有効期限内ならsnapshotを返す
//   // queryが不一致ならundefinedを返してstorageから削除する
//   // 10分以上経過していたらundefinedを返して削除する
//   // JSONが壊れていたらundefinedを返して削除する
//   // Zod検証に失敗したらundefinedを返して削除する
//   // clearSearchSnapshotで削除できる
// });
