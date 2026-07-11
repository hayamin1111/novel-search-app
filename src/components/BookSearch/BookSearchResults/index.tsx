import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types/book";

type Props = {
  books: Book[];
};

export default function BookSearchResults({ books }: Props) {
  return (
    <>
      {books.map((book) => (
        <article key={book.id}>
          <h2>『{book.title}』</h2>
          <p>{book.authors.join(", ")}</p>
          <p>{book.publishedDate}</p>
          {book.thumbnail ? (
            <Image src={book.thumbnail} alt={`${book.title}の表紙`} width={150} height={200} />
          ) : (
            <Image src="/image/dummy.png" alt="表紙なし" width={150} height={200} />
          )}
          <Link href={`/books/${book.id}`}>詳細を見る</Link>
        </article>
      ))}
    </>
  );
}
