import type { Book } from "@/types/book";
import type { SubmitEvent, Dispatch, SetStateAction } from "react";

type Props = {
  setBooks: Dispatch<SetStateAction<Book[]>>;
}
const mockBooks = [
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

export default function BookSearchForm ({setBooks}: Props) {
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    // フォーム送信中止
    e.preventDefault();

    // FormDataでvalueを取得
    const form = new FormData(e.currentTarget);
    const value = form.get("search"); //nameがsearchのフィールドを取得

    if(value === null) return;
    const searchWord: string = String(value).trim(); 
    if (searchWord === "") {
      setBooks([]);
      return;
    }
    const results = mockBooks.filter(book => (book.title?.includes(searchWord))); //タイトル検索
    setBooks(results);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search">タイトル検索</label>
      <input id="search" type="text" name="search" />
      <button type="submit">検索</button>
    </form>
  )
}
