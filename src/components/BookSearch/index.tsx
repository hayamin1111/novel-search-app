"use client";

import { useState } from "react";
import type { Book } from "@/types/book";
import BookSearchForm from "@/components/BookSearch/BookSearchForm";
import BookSearchResults from "@/components/BookSearch/BookSearchResults";

const mockBooks: Book[] = [
  {
    id: '1',
    title: '仮のタイトル',
    authors: ['仮の著者'],
  },
  {
    id: '2',
    title: '仮のタイトル2',
    authors: ['仮の著者2', '仮の著者2-2'],
  },
];

export default function BookSearch () {
  /**
   * 状態管理
   */
  const [books, setBooks] = useState<Book[]>([]); //書籍情報

  const handleSearch = (searchWord: string) => {
    if (searchWord === "") {
      setBooks([]);
      return;
    }

    const results = mockBooks.filter(book => (book.title.includes(searchWord))); //タイトル検索
    
    setBooks(results);
  }

  return (
    <>
      <div>
        <BookSearchForm onSearch={handleSearch} />
      </div>
      <div>
        <BookSearchResults books={books}/>
      </div>
    </>
  )

}
