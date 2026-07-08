"use client";

import { useState } from "react";
import type { Book } from "@/types/book";
import { searchBooks } from "@/lib/googleBooksApi";
import BookSearchForm from "@/components/BookSearch/BookSearchForm";
import BookSearchResults from "@/components/BookSearch/BookSearchResults";

export default function BookSearch() {
  // 状態管理
  const [isLoading, setIsLoading] = useState(false); //検索中ローディング
  const [hasSearched, setHasSearched] = useState(false); //未検索かどうか
  const [books, setBooks] = useState<Book[]>([]); //書籍情報

  const handleSearch = async (searchWord: string) => {
    // 空文字処理
    if (searchWord === "") {
      setBooks([]);
      return;
    }

    setIsLoading(true); // ローディング表示
    setHasSearched(false);

    try {
      // 文字列検索
      const books = await searchBooks(searchWord);
      setBooks(books);
    } catch (error) {
      console.error(error);
      setBooks([]);
    } finally {
      // 検索実行後
      setIsLoading(false); // ローディング非表示
      setHasSearched(true);

      // setHasSearched( books.length === 0 )
      if (books.length === 0) {
        setHasSearched(false);
      }
    }
  };

  return (
    <>
      <div>
        {isLoading && <p>検索中...</p>}
        <BookSearchForm onSearch={handleSearch} />
      </div>
      <div>
        {hasSearched ? (
          <p>該当する書籍が見つかりませんでした</p>
        ) : (
          <p>キーワードを入力してください。</p>
        )}
        <BookSearchResults books={books} />
      </div>
    </>
  );
}
