import SubmissionForm from "@/components/SubmissionForm";

export const metadata = { title: "과제 등록 · 농업 서비스 갤러리" };

export default function NewSubmissionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">과제 등록</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        본인이 만든 농업 서비스를 카드로 등록합니다. 카드를 누른 사람은
        아래 입력한 서비스 URL로 바로 이동합니다.
      </p>
      <SubmissionForm />
    </div>
  );
}
