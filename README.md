# Book Finder

Google Books APIを利用して、書籍タイトルから本を検索できるWebアプリケーションです。

検索結果の一覧表示、追加読み込み、書籍詳細の閲覧に対応しています。

## デモ

- 公開URL：デプロイ後に追加
- [リポジトリ](https://github.com/hayamin1111/novel-search-app)

## スクリーンショット

### 検索結果画面

![Book Finderのトップページ](./public/screenshot-top.png)

### 書籍詳細画面

![Book Finderの詳細ページ](./public/screenshot-detail.png)

## 主な機能

- 書籍タイトルによる検索
- 検索結果を10件ずつ表示
- 「さらに見る」ボタン押下で追加で書籍情報取得
- 書籍詳細ページ
- 表紙画像がない場合の代替表示
- 初期状態、検索中、検索結果なし、エラー状態の表示
- 初回検索と追加読み込みで異なるローディング表示
- 書籍IDによる重複データの除外
- レスポンシブ対応
- キーボード操作やフォーカス表示などのアクセシビリティ対応

## 技術スタック

- Next.js
- React
- TypeScript
- CSS Modules
- Google Books API
- ESLint
- Prettier
- Stylelint
- Vercel

## ページ

### 一覧ページ`/`

書籍の検索と検索結果一覧を表示します。

- タイトル検索
- 検索状態の表示
- 書籍カード一覧
- 追加読み込み

### 詳細ページ`/books/[id]`

選択した書籍の詳細を表示します。

- タイトル
- 著者
- 出版社
- 出版日
- ページ数
- 書籍説明
- 表紙画像
- Google Booksへの外部リンク

## 実装上のポイント

### 外部APIのデータをUI用の型へ変換

Google Books APIのレスポンスを、そのままコンポーネントへ渡さず、一覧表示用と詳細表示用の型に変換しています。
これにより、UI側が外部API固有のデータ構造へ強く依存しないようにしています。

```ts
type Book = {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  thumbnail?: string;
};
```

### 重複データの除外

追加取得時に、すでに表示済みの書籍IDをSetで管理し、同じ書籍が一覧へ重複して追加されないようにしています。

### CSS Modulesによるスタイル管理

コンポーネント単位でCSS Modulesを使用しています。
グローバルな色、余白、文字サイズ、角丸などは、globals.cssのCSSカスタムプロパティで管理しています。

## レスポンシブ対応

固定的なブレークポイントへの依存を減らすため、CSS Grid、`auto-fit`、`minmax()`、`clamp()`などのモダンCSSを活用しています。
コンテンツが自然に折り返す構成を基本とし、メディアクエリはレイアウトの切り替えに必要な箇所だけに限定しています。

## アクセシビリティ

WCAG 2.2のレベルA〜AAの達成基準を参考にして実装しています。

主な対応内容：

- キーボードによる操作
- focus-visibleによるフォーカス表示
- フォーム要素へのアクセシブルネーム
- アイコンだけのボタンへのaria-label
- 装飾SVGへのaria-hidden="true"
- 検索状態を通知するaria-live
- 色のコントラスト

書籍の表紙画像は、同じ領域に書籍タイトルがテキストで表示されているため、重複読み上げを避ける目的で空の`alt`を設定しています。
アイコンなどの装飾画像にも`aria-hidden="true"`を設定し、画面理解に不要な読み上げを抑制しました。

```text
src
├── app
│   ├── books
│   │   └── [id]
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── BookDetail
│   │   └── BookDetailContent
│   ├── BookSearch
│   │   ├── BookSearchForm
│   │   └──  BookSearchResults
│   ├── Footer
│   ├── Header
│   └── icons
├── lib
│   └── googleBooksApi.ts
└── types
    └── book.ts
```

## Getting Started

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

プロジェクトルートに.env.localを作成します。

```bash
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=your_api_key
```

Google Cloud Consoleで、APIキーに以下の制限を設定してください。

APIの制限：Books API
アプリケーションの制限：HTTPリファラー
ローカル開発用：http://localhost:3000/\*

.env.localはGitの管理対象に含めないでください。

### 4. 開発サーバーを起動

```bash
   npm run dev
```

ブラウザで以下へアクセスします。

http://localhost:3000

## Commands

```bash
# 開発サーバー

npm run dev

# ESLint

npm run lint

# Stylelint

npm run lint:css

# Stylelintによる自動修正

npm run lint:css:fix

# 本番ビルド

npm run build

# 本番サーバー

npm run start
```

## 学びと設計判断

### App Routerによる一覧ページと詳細ページの分離

Next.jsのApp Routerを使用し、検索一覧を`/`、書籍詳細を`/books/[id]`として分離しました。
動的ルートを使った詳細ページの実装を経験するとともに、今後のRoute Handlerや動的metadataの実装にも拡張しやすい構成にしています。

### 外部APIのデータをUIへ直接持ち込まない

Google Books APIのレスポンスには、アプリでは使用しない情報や、欠損する可能性のある項目が含まれています。
そのため、APIのレスポンスをそのままコンポーネントへ渡すのではなく、一覧表示用の`Book`型と詳細表示用の`BookDetail`型へ変換しました。
これにより、UI側がGoogle Books API固有のデータ構造へ強く依存せず、必要な値を扱いやすくしています。

### UIの状態を役割ごとに分離

検索画面では、以下の状態を個別に管理しています。

- 検索前
- 初回検索中
- 検索結果あり
- 検索結果なし
- 初回検索エラー
- 追加読み込み中
- 追加読み込みエラー

特に、初回検索と追加読み込みの状態を分けることで、追加取得中も既存の検索結果を残したまま、追加読み込み部分だけを更新できるようにしました。

### 関数型更新による安全なデータ追加

「さらに見る」で取得した書籍は、現在のstateを受け取る関数型更新を使って末尾へ追加しています。
追加時には既存の書籍IDを`Set`で管理し、同じIDの書籍が重複して表示されないようにしています。

### 外部APIのデータ品質に合わせた仕様変更

当初はSF小説に限定した検索を検討していました。
しかし、Google Books APIのカテゴリ情報には欠損や表記揺れがあり、想定した書籍が検索対象から外れるケースがありました。
そのため、精度を担保できないジャンル絞り込みは採用せず、タイトル検索を中心とした仕様へ変更しました。
実装したい機能を優先するのではなく、利用するAPIの実データを確認したうえで要件を見直す重要性を学びました。

### MVPと追加改善を分けて進める

最初からすべての機能を実装するのではなく、検索、一覧、追加読み込み、詳細表示をMVPとして先に完成させました。
検索状態の保持、Route Handler化、動的metadata、テスト、CIなどはMVP後の改善項目として切り分けています。
機能を増やし続けるのではなく、完成と公開を優先して実装範囲を管理することも、この制作で意識した点です。

## 今後の改善点

- 詳細ページから戻った際の検索語、検索結果の保持
- Next.js Route Handlerを経由したAPIアクセス
- APIキーのサーバー側環境変数への移行
- 詳細ページの動的metadata
- ZodによるAPIレスポンスの検証
- Vitestによる単体テスト
- React Testing Libraryによるコンポーネントテスト
- GitHub Actionsによるlint、test、buildの自動実行
- 検索結果の追加取得終了判定の改善
- キャッシュやレート制限の検討
