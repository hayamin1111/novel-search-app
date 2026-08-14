# Book Finder

Google Books APIを利用した書籍検索アプリです。  
タイトル検索、追加読み込み、書籍詳細の閲覧に加え、詳細ページから戻った際の検索結果・スクロール位置の復元に対応しています。

設計面では、外部APIデータの実行時検証、検索状態の明示的な状態遷移、URLとsessionStorageを組み合わせた検索状態の復元を実装しています。

- [デモ](https://bookfinder.ehykw.com/)
- [リポジトリ](https://github.com/hayamin1111/novel-search-app)

## 制作背景

React・Next.jsのキャッチアップに加え、実務で培った設計・実装の考え方を、公開可能な個人制作として示すことを目的に制作しました。
外部データの境界、状態遷移、責務分離、アクセシビリティを意識し、「なぜこの設計にしたか」を説明できる実装を目指しています。

## スクリーンショット

| 検索結果                                                  | 書籍詳細                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| ![Book Finderの検索結果画面](./public/screenshot-top.png) | ![Book Finderの書籍詳細画面](./public/screenshot-detail.png) |

## 主な機能

- 書籍タイトルによる検索
- 初回10件取得と「さらに見る」による追加取得
- 書籍IDを使った重複除外
- 書籍詳細ページ `/books/[id]`
- Loading / Empty / Error状態の表示
- 表紙画像がない場合の代替画像
- Google Booksのdescriptionに含まれるHTMLタグの除去
- URL queryと`sessionStorage`による検索状態の復元
- 検索結果へ戻った際のスクロール位置の復元
- レスポンシブ対応
- キーボード操作、フォーカス表示、状態通知などのアクセシビリティ対応
- `error.tsx` / `not-found.tsx`によるエラー・404表示

## 技術スタック

| 分類       | 技術                          |
| ---------- | ----------------------------- |
| Framework  | Next.js 16（App Router）      |
| UI         | React 19                      |
| Language   | TypeScript                    |
| Styling    | CSS Modules                   |
| Validation | Zod                           |
| API        | Google Books API              |
| Quality    | ESLint / Prettier / Stylelint |
| Hosting    | Vercel                        |

## 設計・実装のポイント

### 外部APIのデータを検証してからUIへ渡す

Google Books APIのレスポンスは、Zodで実行時検証してからアプリ内の`Book` / `BookDetail`型へ変換しています。

検索レスポンスでは各itemを個別に検証し、不正なitemだけを除外します。1件の不正データで検索結果全体が失敗しない設計です。

```text
Google Books API response
        ↓
Zodによる実行時検証
        ↓
GoogleBooksItem
        ↓
Mapperによる変換
        ↓
Book / BookDetail
        ↓
UI
```

`googleBooksApi.ts`はAPI通信・HTTPエラー・Zod検証を担当し、`googleBooksMapper.ts`は検証済みデータから表示用データへの変換を担当します。外部API固有の構造をUIへ直接漏らさないようにしています。

### useReducerによる検索状態の管理

検索機能の追加に伴い、複数の`useState`と連続したsetterによる状態更新が複雑になったため、`useReducer`へ変更しました。

```text
SEARCH_STARTED
  ├─ SEARCH_SUCCEEDED
  └─ SEARCH_FAILED

LOAD_MORE_STARTED
  ├─ LOAD_MORE_SUCCEEDED
  └─ LOAD_MORE_FAILED
```

「値をどう変更するか」ではなく「何が起きたか」をactionとして表現しています。検索状態は`idle` / `loading` / `success` / `error`で管理し、初期表示・検索中・0件・結果あり・エラーのUIをstatusから導出しています。

### URLとsessionStorageの役割分担

詳細ページから検索結果へ戻っても、検索状況を維持できるようにしています。

- URL query：どの検索かを表す検索語
- `sessionStorage`：その検索がどこまで進んでいたかを表す一時状態

`SearchSnapshot`には次の値を保存します。

```ts
type SearchSnapshot = {
  query: string;
  books: Book[];
  nextStartIndex: number;
  hasMore: boolean;
  scrollY: number;
  savedAt: number;
};
```

復元時は次の条件を確認します。

1. JSONとして読み取れること
2. Zodのスキーマを満たすこと
3. 保存から10分以内であること
4. URL queryとsnapshotのqueryが一致すること

利用できないsnapshotは削除し、URL queryを使って通常検索します。スクロール位置は描画に使うstateではないため`useRef`に保持し、書籍カードの描画後に一度だけ復元します。

詳細ページの「検索結果に戻る」には`router.back()`ではなく、検索語を引き継いだ`Link`を使用しています。詳細ページへ直接アクセスした場合でも、アプリ外へ戻らず意図した検索画面へ移動させるためです。

### 副作用と純粋処理の分離

コンポーネントの責務を小さくし、後から単体テストしやすい構成を意識しています。

| ファイル               | 責務                                |
| ---------------------- | ----------------------------------- |
| `googleBooksApi.ts`    | API通信、HTTPエラー、Zod検証        |
| `googleBooksMapper.ts` | APIデータからアプリ内データへの変換 |
| `searchSnapshot.ts`    | sessionStorageへの保存・検証・復元  |
| `books.ts`             | 書籍IDによる重複除外                |
| `searchReducer.ts`     | 検索状態の遷移                      |

`mergeUniqueBooks()`やMapperはReact・ブラウザAPIに依存しない純粋関数として切り出しています。

### レスポンシブとアクセシビリティ

CSS Gridの`auto-fit` / `minmax()`や`clamp()`を使い、固定的なブレークポイントへの依存を抑えています。最小幅360pxからデスクトップまで、検索フォームとカード一覧が自然に変化する構成です。

WCAG 2.2のレベルA〜AAを参考に、主に次の対応を行っています。

- キーボード操作と`:focus-visible`によるフォーカス表示
- フォームとアイコンボタンへのアクセシブルネーム
- 装飾SVGの読み上げ除外
- `role="status"`による検索・追加読み込み状態の通知
- `role="alert"`によるエラー通知
- リンクとボタンの役割の区別
- 色のコントラストとタップ領域への配慮

## ディレクトリ構成

```text
src
├── app
│   ├── books/[id]/page.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── BookDetail
│   ├── BookSearch
│   │   ├── BookSearchForm
│   │   ├── BookSearchResults
│   │   └── searchReducer.ts
│   ├── Footer
│   ├── Header
│   └── icons
├── lib
│   ├── books.ts
│   ├── googleBooksApi.ts
│   ├── googleBooksMapper.ts
│   └── searchSnapshot.ts
├── schemas
│   ├── books.ts
│   └── searchSnapshot.ts
└── types
    ├── book.ts
    └── searchSnapshot.ts
```

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/hayamin1111/novel-search-app.git
cd novel-search-app
```

### 2. パッケージをインストール

```bash
npm install
```

### 3. 環境変数を設定

プロジェクトルートに`.env.local`を作成します。

```bash
GOOGLE_BOOKS_API_KEY=your_api_key
```

Google Cloud ConsoleでBooks APIを有効にし、APIキーにAPI・HTTPリファラー制限を設定してください。

### 4. 開発サーバーを起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)へアクセスします。

## コマンド

| コマンド               | 内容                |
| ---------------------- | ------------------- |
| `npm run dev`          | 開発サーバーを起動  |
| `npm run build`        | 本番ビルド          |
| `npm run start`        | 本番サーバーを起動  |
| `npm run lint`         | ESLintを実行        |
| `npm run lint:css`     | Stylelintを実行     |
| `npm run lint:css:fix` | Stylelintで自動修正 |
| `npm run format`       | Prettierで整形      |
| `npm run format:check` | Prettierの差分確認  |

## 今後の改善

- Route Handler経由でGoogle Books APIへアクセスし、APIキーをサーバー側へ移動
- 詳細ページの動的metadata
- Vitest / React Testing Libraryによるテスト
- GitHub Actionsによるlint・test・buildの自動実行
- APIレスポンスの取得件数を基準にした追加取得終了判定の改善
- キャッシュ・レート制限の検討
