import type { Metadata } from "next";
import { Cherry_Bomb_One } from "next/font/google";
import "./globals.css";

const cherryBombOne = Cherry_Bomb_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cherry-bomb-one",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Book Finder",
  description: "気になる本をタイトルから探せる書籍検索サービスです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cherryBombOne.variable}>
      <body>{children}</body>
    </html>
  );
}
