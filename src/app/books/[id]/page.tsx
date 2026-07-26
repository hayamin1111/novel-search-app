import type { Metadata } from "next";
import BookDetail from "@/components/BookDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "書籍詳細｜Book Finder",
  description: "Book Finderの書籍詳細ページです。",
};

export default async function BookDetailPage({ params }: Props) {
  // paramsはPromise型なので解決してから値を使用する
  const { id } = await params;
  return (
    <>
      <BookDetail id={id} />
    </>
  );
}
