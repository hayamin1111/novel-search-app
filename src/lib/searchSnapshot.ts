import type { SearchSnapshot } from "@/types/searchSnapshot";
import { SearchSnapshotSchema } from "@/schemas/searchSnapshot";

const SEARCH_SNAPSHOT_KEY = "bookSearchSnapshot"; // ブラウザバック時の処理のためにsessionStorageへ保存するキー
const SEARCH_SNAPSHOT_TTL_MS = 10 * 60 * 1000;

/**
 * sessionStorageを読んで保存したsnapshotを返す
 */
export const getSearchSnapshot = (query: string): SearchSnapshot | undefined => {
  const storedSnapshot = sessionStorage.getItem(SEARCH_SNAPSHOT_KEY); // sessionStorageに保存したキーから検索内容を復元

  if (!storedSnapshot) return;

  try {
    const snapshot = JSON.parse(storedSnapshot); //JSONをオブジェクトに戻す
    const parsedSnapshot = SearchSnapshotSchema.safeParse(snapshot);
    if (!parsedSnapshot.success) {
      console.error("Snapshot response validation failed", parsedSnapshot.error);
      sessionStorage.removeItem(SEARCH_SNAPSHOT_KEY);
      return;
    }
    const result = parsedSnapshot.data;

    const isExpired = Date.now() - result.savedAt >= SEARCH_SNAPSHOT_TTL_MS; //　セッションの有効期限チェック
    if (isExpired) {
      sessionStorage.removeItem(SEARCH_SNAPSHOT_KEY);
      return;
    }

    if (result.query !== query) {
      sessionStorage.removeItem(SEARCH_SNAPSHOT_KEY); //保存したqueryとURLクエリパラメータが同じか確認
      return;
    }

    return result;
  } catch (error) {
    console.error(error);
    sessionStorage.removeItem(SEARCH_SNAPSHOT_KEY);
    return;
  }
};

/**
 * snapshotをsessionStorageに保存
 */
export const saveSearchSnapshot = (snapshot: SearchSnapshot) => {
  sessionStorage.setItem(SEARCH_SNAPSHOT_KEY, JSON.stringify(snapshot)); //文字列（JSON）に変換してから保存する
};

/**
 * snapsotをsessionStorageから削除
 */
export const clearSearchSnapshot = () => {
  sessionStorage.removeItem(SEARCH_SNAPSHOT_KEY);
};
