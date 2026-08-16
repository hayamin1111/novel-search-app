import { expect, describe, test } from "vitest";
import type { Book } from "@/types/book";
import { mergeUniqueBooks } from "./books";

// Arrange: テスト用データ
const existingBooks: Book[] = [
  {
    id: "book-1",
    title: "既存の書籍1",
    authors: ["著者A"],
    publishedDate: "2024-01-01",
  },
  {
    id: "book-2",
    title: "既存の書籍2",
    authors: ["著者B"],
    publishedDate: "2024-02-01",
  },
];
const incomingBooks: Book[] = [
  {
    id: "book-2",
    title: "既存IDと重複する書籍",
    authors: ["著者B"],
    publishedDate: "2024-02-01",
  },
  {
    id: "book-3",
    title: "追加する書籍3",
    authors: ["著者C"],
    publishedDate: "2024-03-01",
  },
  {
    id: "book-3",
    title: "追加データ内で重複する書籍",
    authors: ["著者C"],
    publishedDate: "2024-03-01",
  },
  {
    id: "book-4",
    title: "追加する書籍4",
    authors: ["著者D"],
    publishedDate: "2024-04-01",
  },
];

describe("mergeUniqueBooks", () => {
  test("重複しない書籍を末尾に追加できる（既存+追加）", () => {
    // Arrange: テスト用データ
    const nonDuplicateIncomingBooks = [incomingBooks[1], incomingBooks[3]];

    // Act: テスト対象を実行
    const result = mergeUniqueBooks(existingBooks, nonDuplicateIncomingBooks);

    // Assert: 結果を確認
    expect(result).toEqual([...existingBooks, ...nonDuplicateIncomingBooks]);
  });

  test("既存の書籍IDと重複する書籍を除外できる（既存）", () => {
    // Arrange: テスト用データ
    const baseExistingBooks = [existingBooks[0], existingBooks[1]];
    const duplicateIncomingBooks = [existingBooks[0]];

    // Act: テスト対象を実行
    const result = mergeUniqueBooks(baseExistingBooks, duplicateIncomingBooks);

    // Assert: 結果を確認
    expect(result).toEqual(baseExistingBooks);
  });

  test("追加書籍内でIDが重複している場合も除外できる（追加）", () => {
    // Arrange: テスト用データ
    const firstBooks = [existingBooks[0]];
    const secondBooks = [incomingBooks[1], incomingBooks[2], incomingBooks[3]];

    // Act: テスト対象を実行
    const result = mergeUniqueBooks(firstBooks, secondBooks);

    // Assert: 結果を確認
    expect(result).toEqual([existingBooks[0], incomingBooks[1], incomingBooks[3]]);
  });

  test("結果の並び順が維持されている（既存→追加）", () => {
    // Arrange: テスト用データ
    const firstBooks = [existingBooks[0]];
    const secondBooks = [incomingBooks[3]];

    // Act: テスト対象を実行
    const result = mergeUniqueBooks(firstBooks, secondBooks);

    // Assert: 結果を確認
    expect(result).toEqual([existingBooks[0], incomingBooks[3]]);
  });

  test("元の2つの配列を変更しない（既存・追加）", () => {
    // Arrange: テスト用データ
    const firstBooks = [existingBooks[0], existingBooks[1]];
    const secondBooks = [incomingBooks[2], incomingBooks[3]];

    const firstBooksBefore = [...firstBooks];
    const secondBooksBefore = [...secondBooks];

    // Act: テスト対象を実行
    mergeUniqueBooks(firstBooks, secondBooks);

    // Assert: 結果を確認
    expect(firstBooks).toEqual(firstBooksBefore);
    expect(secondBooks).toEqual(secondBooksBefore);
  });
});
