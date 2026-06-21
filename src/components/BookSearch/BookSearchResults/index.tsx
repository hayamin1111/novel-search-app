// import BookList from "@/components/BookSearch/BookList"
import type { Book } from "@/types/book";

type Props = {
  books: Book[],
};

export default function BookSearchResults ({books}: Props) {

  return (
    <ul>
      {
        books.map(book => (
          <li key={book.id}>『{book.title}』（{book.authors.join(", ")}）</li>
        ))
      }
    </ul>
  )
}
