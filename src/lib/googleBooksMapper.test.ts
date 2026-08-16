import { expect, describe, test } from "vitest";
import type { GoogleBooksItem } from "@/types/book";
import { mapGoogleBooksItemToBook, mapGoogleBooksItemToBookDetail } from "./googleBooksMapper";

// Arrange: テスト用データ
const googleBooksItemFixture: GoogleBooksItem = {
  id: "test-book-1",
  volumeInfo: {
    title: "テスト用書籍タイトル",
    authors: ["著者A", "著者B"],
    publisher: "テスト出版社",
    publishedDate: "2024-05-20",
    imageLinks: {
      thumbnail: "http://example.com/test-thumbnail.jpg",
    },
    description: "<p>概要です。<br>2行目です。<wbr>3行目です。</p>",
    pageCount: 320,
    previewLink: "https://books.google.com/test-preview",
  },
};
const googleBooksItemWithMissingFields: GoogleBooksItem = {
  id: "test-book-2",
  volumeInfo: {},
};

describe("mapGoogleBooksItemToBook", () => {
  test("正常系：入力値がBook型相当の形に変換できる", () => {
    // Act: テスト対象を実行
    const result = mapGoogleBooksItemToBook(googleBooksItemFixture);

    // Assert: 結果を確認
    expect(result).toEqual({
      id: "test-book-1",
      title: "テスト用書籍タイトル",
      authors: ["著者A", "著者B"],
      publishedDate: "2024-05-20",
      thumbnail: "https://example.com/test-thumbnail.jpg",
    });
  });

  test("未設定項目に代替値を入れられる", () => {
    // Act: テスト対象を実行
    const result = mapGoogleBooksItemToBook(googleBooksItemWithMissingFields);

    // Assert: 結果を確認
    expect(result).toEqual({
      id: "test-book-2",
      title: "タイトル不明",
      authors: ["著者不明"],
      publishedDate: "出版日不明",
      thumbnail: undefined,
    });
  });

  test("戻り値の変換が問題なくできる（thumbnail を https に正規化できる）", () => {
    // Act: テスト対象を実行
    const result = mapGoogleBooksItemToBook(googleBooksItemFixture);

    // Assert: 結果を確認
    expect(result.thumbnail).toBe("https://example.com/test-thumbnail.jpg");
  });
});

describe("mapGoogleBooksItemToBookDetail", () => {
  test("descriptionを成型（HTMLを除去、<br> を改行へ変換）できる", () => {
    // Act: テスト対象を実行
    const result = mapGoogleBooksItemToBookDetail(googleBooksItemFixture);

    // Assert: 結果を確認
    expect(result).toEqual({
      id: "test-book-1",
      title: "テスト用書籍タイトル",
      authors: ["著者A", "著者B"],
      publisher: "テスト出版社",
      publishedDate: "2024-05-20",
      description: "概要です。\n2行目です。3行目です。",
      pageCount: 320,
      previewLink: "https://books.google.com/test-preview",
      thumbnail: "https://example.com/test-thumbnail.jpg",
    });
  });

  test("descriptionを成型（HTMLを除去、<br> を改行へ変換）できる", () => {
    // Act: テスト対象を実行
    const result = mapGoogleBooksItemToBookDetail(googleBooksItemFixture);

    // Assert: 結果を確認
    expect(result.description).toBe("概要です。\n2行目です。3行目です。");
  });

  test("publisherなど詳細用の代替値を入れられる", () => {
    // Act: テスト対象を実行
    const result = mapGoogleBooksItemToBookDetail(googleBooksItemWithMissingFields);

    // Assert: 結果を確認
    expect(result).toEqual({
      id: "test-book-2",
      title: "タイトル不明",
      authors: ["著者不明"],
      publisher: "出版社不明",
      publishedDate: "出版日不明",
      description: "詳細不明",
      pageCount: undefined,
      previewLink: undefined,
      thumbnail: undefined,
    });
  });
});
