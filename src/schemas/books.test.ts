import { expect, describe, test } from "vitest";
import type { GoogleBooksItem, GoogleBooksSearchResponse } from "@/types/book";
import { GoogleBooksItemSchema, GoogleBooksSearchResponseSchema, BookSchema } from "./books";

// Arrange: テスト用データ
const validGoogleBooksItem = {
  id: "test-book-1",
  volumeInfo: {
    title: "テスト用書籍タイトル",
    authors: ["著者A", "著者B"],
    publisher: "テスト出版社",
    publishedDate: "2024-05-20",
    imageLinks: {
      thumbnail: "https://example.com/test-thumbnail.jpg",
    },
    description: "<p>概要です。<br>2行目です。</p>",
    pageCount: 320,
    previewLink: "https://books.google.com/test-preview",
  },
} satisfies GoogleBooksItem;

const validSearchResponse = {
  items: [validGoogleBooksItem],
} satisfies GoogleBooksSearchResponse;

const invalidSearchResponse = {
  items: "配列じゃない",
};

const validBook = {
  id: "book-1",
  title: "テスト本",
  authors: ["著者A"],
  publishedDate: "2024-01-01",
  thumbnail: "https://example.com/book.jpg",
};

describe("GoogleBooksItemSchema", () => {
  test("正常なデータを通せる", () => {
    // Act: テスト対象を実行
    const result = GoogleBooksItemSchema.safeParse(validGoogleBooksItem);
    // Assert: 結果を確認
    expect(result.success).toBe(true);
  });

  test("idなしを弾ける", () => {
    // Arrange: テスト用データ
    const invalidItem = {
      volumeInfo: validGoogleBooksItem.volumeInfo,
    };
    // Act: テスト対象を実行
    const result = GoogleBooksItemSchema.safeParse(invalidItem);
    // Assert: 結果を確認
    expect(result.success).toBe(false);
  });

  test("volumeInfoなしを弾ける", () => {
    // Arrange: テスト用データ
    const invalidItem = {
      id: validGoogleBooksItem.id,
    };
    // Act: テスト対象を実行
    const result = GoogleBooksItemSchema.safeParse(invalidItem);
    // Assert: 結果を確認
    expect(result.success).toBe(false);
  });

  test("authorsの型不正を弾ける", () => {
    // Arrange: テスト用データ
    const invalidAuthorsTypeItem = {
      id: validGoogleBooksItem.id,
      volumeInfo: {
        ...validGoogleBooksItem.volumeInfo,
        authors: 123, // numberにする
      },
    };
    // Act: テスト対象を実行
    const result = GoogleBooksItemSchema.safeParse(invalidAuthorsTypeItem);
    // Assert: 結果を確認
    expect(result.success).toBe(false);
  });

  test("pageCountの型不正を弾ける", () => {
    // Arrange: テスト用データ
    const invalidPageCountTypeItem = {
      id: validGoogleBooksItem.id,
      volumeInfo: {
        ...validGoogleBooksItem.volumeInfo,
        pageCount: "20ページ", // stringにする
      },
    };
    // Act: テスト対象を実行
    const result = GoogleBooksItemSchema.safeParse(invalidPageCountTypeItem);
    // Assert: 結果を確認
    expect(result.success).toBe(false);
  });
});

describe("GoogleBooksSearchResponseSchema", () => {
  test("正常なデータを通せる", () => {
    // Act: テスト対象を実行
    const result = GoogleBooksSearchResponseSchema.safeParse(validSearchResponse);
    // Assert: 結果を確認
    expect(result.success).toBe(true);
  });

  test("空のデータでも通せる", () => {
    // Arrange: テスト用データ
    const validEmptySearchResponse = {};
    // Act: テスト対象を実行
    const result = GoogleBooksSearchResponseSchema.safeParse(validEmptySearchResponse);
    // Assert: 結果を確認
    expect(result.success).toBe(true);
  });

  test("itemsの型不正を弾ける", () => {
    // Act: テスト対象を実行
    const result = GoogleBooksSearchResponseSchema.safeParse(invalidSearchResponse);
    // Assert: 結果を確認
    expect(result.success).toBe(false);
  });
});

describe("BookSchema", () => {
  test("正常なデータを通せる", () => {
    // Act: テスト対象を実行
    const result = BookSchema.safeParse(validBook);
    // Assert: 結果を確認
    expect(result.success).toBe(true);
  });

  test("authorsの型不正を弾ける", () => {
    // Arrange: テスト用データ
    const invalidBookWithInvalidAuthors = {
      ...validBook,
      authors: 333,
    };
    // Act: テスト対象を実行
    const result = BookSchema.safeParse(invalidBookWithInvalidAuthors);
    // Assert: 結果を確認
    expect(result.success).toBe(false);
  });
});
