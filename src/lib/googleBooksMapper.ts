//検証済みデータをアプリ用データへ変換
import type { GoogleBooksItem, Book, BookDetail } from "@/types/book";

/**
 * HTMLタグの処理（brは\n、）
 */
const stripHtml = (html: string) => {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<wbr\s*\/?>/gi, "")
    .replace(/<[^>]*>/g, "");
};

/**
 * thumbnail URLをHTTPSへ変換
 */
const normalizeThumbnailUrl = (thumbnail: string | undefined) => {
  return thumbnail?.replace(/^http:\/\//, "https://");
};

/**
 * 一覧ページ表示用に加工
 */
export const mapGoogleBooksItemToBook = (item: GoogleBooksItem): Book => {
  const thumbnail = normalizeThumbnailUrl(item.volumeInfo.imageLinks?.thumbnail);

  return {
    id: item.id,
    title: item.volumeInfo.title ?? "タイトル不明",
    authors: item.volumeInfo.authors ?? ["著者不明"],
    publishedDate: item.volumeInfo.publishedDate ?? "出版日不明",
    thumbnail,
  };
};

/**
 * 詳細ページ表示用に加工
 */
export const mapGoogleBooksItemToBookDetail = (item: GoogleBooksItem): BookDetail => {
  const thumbnail = normalizeThumbnailUrl(item.volumeInfo.imageLinks?.thumbnail);
  return {
    id: item.id,
    title: item.volumeInfo.title ?? "タイトル不明",
    authors: item.volumeInfo.authors ?? ["著者不明"],
    publisher: item.volumeInfo.publisher ?? "出版社不明",
    publishedDate: item.volumeInfo.publishedDate ?? "出版日不明",
    // descriptionのみHTMLが入っているので別で処理
    description: item.volumeInfo.description ? stripHtml(item.volumeInfo.description) : "詳細不明",
    pageCount: item.volumeInfo.pageCount,
    thumbnail,
    previewLink: item.volumeInfo.previewLink,
  };
};
