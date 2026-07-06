import BookDetail from "@/components/BookDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
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
