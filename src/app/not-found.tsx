import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <p>ページが見つかりません。</p>
      <Link href="/">書籍検索トップページへ</Link>
    </>
  );
}
