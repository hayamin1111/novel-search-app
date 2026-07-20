import type { Metadata } from "next";
import { Righteous } from "next/font/google";
import "./globals.css";

const righteous = Righteous({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-righteous",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Book Finder - 気になる本をタイトルから探せる -",
  description: "気になる本をタイトルから探せる書籍検索サービスです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={righteous.variable}>
      <body>{children}</body>
    </html>
  );
}
