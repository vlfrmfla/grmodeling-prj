import SubmissionForm from "@/components/SubmissionForm";

export const metadata = { title: "과제 등록" };

export default function NewSubmissionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">
        과제 등록
      </h1>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">
        본인이 만든 스마트 온실 · 농업 관련 서비스를 카드로 등록합니다.
        카드를 누른 사람은 입력한 서비스 URL로 바로 이동합니다.
      </p>
      <SubmissionForm />
    </div>
  );
}
