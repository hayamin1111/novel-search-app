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
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]); //書籍情報

  const handleSearch = async (searchWord: string) => {
    // 空文字処理
    if (searchWord === "") {
      setBooks([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setBooks([]); //前回検索結果は削除
    setError(null); //前回のエラー表示は削除

    try {
      // 文字列検索
      const books = await searchBooks(searchWord);
      setBooks(books);
      setHasSearched(true);
    } catch (error) {
      console.error(error);
      setBooks([]);
      setHasSearched(true);
      setError("書籍情報の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const isInitial = !isLoading && !hasSearched && !error;
  const isEmpty = !isLoading && hasSearched && books.length === 0 && !error;
  const hasResults = books.length > 0;

  return (
    <>
      <div>
        {isInitial && <p>キーワードを入力してください。</p>}
        <BookSearchForm onSearch={handleSearch} />
        {isLoading && <p>検索中...</p>}
        {error && <p>{error}</p>}
      </div>
      <div>
        {isEmpty && <p>該当する書籍が見つかりませんでした。</p>}
        {hasResults && <BookSearchResults books={books} />}
      </div>
    </>
  );
}
