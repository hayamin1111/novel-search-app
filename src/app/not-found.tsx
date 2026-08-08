import Link from "next/link";
import NotFoundIcon from "@/components/icons/NotFoundIcon";
import Header from "@/components/Header";
import linkStyles from "@/styles/link.module.css";
import feedbackStyles from "@/styles/feedback.module.css";
import statusPageStyles from "@/styles/status-page.module.css";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={statusPageStyles.page}>
        <div className={feedbackStyles.notFound}>
          <h1 className={feedbackStyles.notFoundTitle} aria-label="404 not found">
            <NotFoundIcon className={feedbackStyles.notFoundIcon} />
          </h1>
          <p className={feedbackStyles.notFoundText}>ページが見つかりません。</p>
        </div>

        <Link href="/" className={`${linkStyles.backLink} ${linkStyles.backLinkLight}`}>
          <span aria-hidden="true">←</span>
          トップページへ戻る
        </Link>
      </main>
    </>
  );
}
