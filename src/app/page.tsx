// import {mockBooks} from "@/lib/googleBooksApi";
// import Image from "next/image";
import BookSearch from "@/components/BookSearch";

export default function Home() {
  return (
    <div className="">
      <header>
        <h1>SF小説検索アプリ</h1>
      </header>
      <main className="">
        <p>
          ここではScience Fiction小説を検索できます。
          <br />
          気になる単語を入力してください。
        </p>
        <BookSearch />
      </main>
      <footer>
        <small>SF小説検索アプリ &copy;2026hykw</small>
      </footer>
    </div>
  );
}
