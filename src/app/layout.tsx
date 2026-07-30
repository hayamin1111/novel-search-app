import type { Metadata } from "next";
import { Righteous } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

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
      <body>
        <div className="container">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
