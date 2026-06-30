import BookSearch from "@/components/BookSearch";

export default function Home() {
  return (
    <div className="">
      <header>
        <h1>書籍検索アプリ</h1>
      </header>
      <main className="">
        <p>
          気になる本のタイトルを検索できます。
          <br />
          キーワードを入力してください。
        </p>
        <BookSearch />
      </main>
      <footer>
        <small>書籍検索アプリ &copy;2026hykw</small>
      </footer>
    </div>
  );
}
