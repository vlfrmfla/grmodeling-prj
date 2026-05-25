import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "로그인" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">로그인</h1>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
        과제를 등록하려면 로그인해 주세요.
      </p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
