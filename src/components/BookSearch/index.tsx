"use client";

import { useState } from "react";
import type { Book } from "@/types/book";
import BookSearchForm from "@/components/BookSearch/BookSearchForm";
import BookSearchResults from "@/components/BookSearch/BookSearchResults";

const mockBooks: Book[] = [
  {
    id: "1",
    title: "仮のタイトル",
    authors: ["仮の著者"],
  },
  {
    id: "2",
    title: "仮のタイトル2",
    authors: ["仮の著者2", "仮の著者2-2"],
  },
];

export default function BookSearch() {
  /**
   * 状態管理
   */
  const [books, setBooks] = useState<Book[]>([]); //書籍情報

  const handleSearch = async (searchWord: string) => {
    if (searchWord === "") {
      setBooks([]);
      return;
    }

    const query = `${searchWord} subject:science+fiction`; // 検索ワードにSFを追加する
    const encodedQuery = encodeURIComponent(query); // 文字列を安全にエンコード
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&printType=books&maxResults=10`;

    const response = await fetch(url);
    if (!response.ok) return;
    console.log(response);

    const results = mockBooks.filter((book) => book.title.includes(searchWord)); //タイトル検索

    setBooks(results);
  };

  return (
    <>
      <div>
        <BookSearchForm onSearch={handleSearch} />
      </div>
      <div>
        <BookSearchResults books={books} />
      </div>
    </>
  );
}
