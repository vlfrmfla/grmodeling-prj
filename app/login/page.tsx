import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "로그인 · 농업 서비스 갤러리" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-xl font-bold mb-6">로그인</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
