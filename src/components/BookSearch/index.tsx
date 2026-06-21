"use client";

import { useState } from "react";
import type { Book } from "@/types/book";
import BookSearchForm from "@/components/BookSearch/BookSearchForm/";



export default function BookSearch () {

  /**
   * 状態管理
   */
  const [books, setBooks] = useState<Book[]>([]); //書籍情報


  return (
    <>
      <div>
        <BookSearchForm setBooks={setBooks} />





      </div>
      <div>
        <ul>
          {
            books.map(book => (
              <li key={book.id}>『{book.title}』（{book.authors.join(", ")}）</li>
            ))
          }
        </ul>
        {/* <BookSearchResults /> */}
      </div>
    </>
  )

}
