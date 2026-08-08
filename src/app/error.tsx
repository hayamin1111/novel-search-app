"use client";
import Link from "next/link";
import Header from "@/components/Header";
import ErrorIcon from "@/components/icons/ErrorIcon";
import feedbackStyles from "@/styles/feedback.module.css";
import linkStyles from "@/styles/link.module.css";
import statusPageStyles from "@/styles/status-page.module.css";

export default function Error() {
  return (
    <>
      <Header />
      <main className={statusPageStyles.page}>
        <div className={feedbackStyles.error}>
          <ErrorIcon className={feedbackStyles.errorIcon} />
          <p className={feedbackStyles.errorText}>
            エラーが発生しました。時間をおいて再度お試しください。
          </p>
        </div>
        <Link href="/" className={`${linkStyles.backLink} ${linkStyles.backLinkLight}`}>
          <span aria-hidden="true">←</span>
          検索結果に戻る
        </Link>
      </main>
    </>
  );
}
