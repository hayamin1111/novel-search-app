"use client";

import { useState } from "react";
import type { Book } from "@/types/book";
import { searchBooks } from "@/lib/googleBooksApi";
import BookSearchForm from "@/components/BookSearch/BookSearchForm";
import BookSearchResults from "@/components/BookSearch/BookSearchResults";

// const mockBooks: Book[] = [
//   {
//     id: "1",
//     title: "仮のタイトル",
//     authors: ["仮の著者"],
//   },
//   {
//     id: "2",
//     title: "仮のタイトル2",
//     authors: ["仮の著者2", "仮の著者2-2"],
//   },
// ];

export default function BookSearch() {
  // 状態管理
  const [books, setBooks] = useState<Book[]>([]); //書籍情報

  const handleSearch = async (searchWord: string) => {
    // 空文字処理
    if (searchWord === "") {
      setBooks([]);
      return;
    }

    try {
      const books = await searchBooks(searchWord);
      setBooks(books);
    } catch (error) {
      console.error(error);
      setBooks([]);
    }
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
