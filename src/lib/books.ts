import type { Book } from "@/types/book";

export const mergeUniqueBooks = (existingBooks: Book[], incomingBooks: Book[]): Book[] => {
  const existingBookIds = new Set(existingBooks.map((book) => book.id));

  const uniqueBooks = incomingBooks.filter((book) => {
    if (existingBookIds.has(book.id)) {
      return false;
    }

    existingBookIds.add(book.id);
    return true;
  });

  return [...existingBooks, ...uniqueBooks]; //既存結果の末尾に追加
};
