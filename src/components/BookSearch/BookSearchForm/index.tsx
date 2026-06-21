import type { SubmitEvent } from "react";

type Props = {
  onSearch: (searchWord: string) => void;
};


export default function BookSearchForm ({onSearch}: Props) {
  /**
   * submitを受け取り入力値を親へ渡す
   */
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    // フォーム送信中止
    e.preventDefault();

    // FormDataでvalueを取得
    const form = new FormData(e.currentTarget);
    const value = form.get("search"); //nameがsearchのフィールドを取得

    if(value === null) return;
    const searchWord: string = String(value).trim(); 
    
    onSearch(searchWord);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search">タイトル検索</label>
      <input id="search" type="text" name="search" />
      <button type="submit">検索</button>
    </form>
  )
}
