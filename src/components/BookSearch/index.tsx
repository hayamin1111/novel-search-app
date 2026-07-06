"use client";

import { useState } from "react";
import type { Book } from "@/types/book";
import { searchBooks } from "@/lib/googleBooksApi";
import BookSearchForm from "@/components/BookSearch/BookSearchForm";
import BookSearchResults from "@/components/BookSearch/BookSearchResults";

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
      // 文字列検索
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
