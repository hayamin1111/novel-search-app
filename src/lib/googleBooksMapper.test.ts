import { expect, test, describe, it } from "vitest";
import type { GoogleBooksItem } from "@/types/book";
import type { Book } from "@/types/book";
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

// 正常系：GoogleBooksItemをBookに変換
// thumbnailはURLがhttpならhttpsになる
// title、authors、publishedDate が空の時に代替テキストが返される
// descriptionの<br> が改行になる
// description に HTML が含まれる場合、BookDetail では除去される
// 元のitemを破壊しない

describe("mapGoogleBooksItemToBook", () => {
  it("正常系：入力値が Book 型相当の形に変換される", () => {
    const nonDuplicateIncomingBooks = [incomingBooks[1], incomingBooks[3]];

    // Act: テスト対象を実行
    const result = mapGoogleBooksItemToBook(item);

    // Assert: 結果を確認
    expect(result).toEqual([...existingBooks, ...nonDuplicateIncomingBooks]);
  });
  // 未設定項目に代替値を入れられる
  // 戻り値の変換が問題なくできているか（thumbnail を https に正規化できる）
});

// description の HTML を除去できる
// <br> を改行へ変換できる
// publisher など詳細用の代替値を入れられる
