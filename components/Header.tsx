// Server component: reads session state and renders top navigation.
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="text-base font-semibold tracking-tight">
            스마트 온실 모델링
          </span>
          <span className="hidden sm:inline text-xs text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition">
            프로젝트 갤러리
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link href="/submissions/new" className="btn-primary">
                + 과제 등록
              </Link>
              <Link
                href="/my"
                className="px-3 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition"
              >
                내 제출물
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link href="/login" className="btn-ghost">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
