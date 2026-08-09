import type { Metadata } from "next";
import Header from "@/components/Header";
import BookDetail from "@/components/BookDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "書籍詳細｜Book Finder",
  description: "Book Finderの書籍詳細ページです。",
};

export default async function BookDetailPage({ params, searchParams }: Props) {
  // paramsはPromise型なので解決してから値を使用する
  const { id } = await params;

  const { q } = await searchParams;
  const searchWord = typeof q === "string" ? q.trim() : "";

  return (
    <>
      <Header />
      <BookDetail id={id} searchWord={searchWord} />
    </>
  );
}
