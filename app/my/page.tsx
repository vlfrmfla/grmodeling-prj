import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SubmissionCard from "@/components/SubmissionCard";
import type { Submission } from "@/lib/schemas";

export const metadata = { title: "내 제출물" };

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware/proxy already redirects unauthenticated users, but be defensive.
  if (!user) return null;

  const { data } = await supabase
    .from("submissions")
    .select(
      "id, user_id, title, service_url, description, category, tech_stack, thumbnail_url, created_at, updated_at, profiles(name, department)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const items = (data ?? []) as unknown as Submission[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">내 제출물</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            내가 등록한 카드를 한눈에 관리합니다.
          </p>
        </div>
        <Link href="/submissions/new" className="btn-primary">
          + 새 과제
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center text-stone-500 dark:text-stone-400">
          아직 등록한 과제가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <div key={s.id} className="space-y-2">
              <SubmissionCard s={s} />
              <div className="flex gap-3 text-xs px-1">
                <Link
                  href={`/submissions/${s.id}`}
                  className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition"
                >
                  상세
                </Link>
                <Link
                  href={`/submissions/${s.id}/edit`}
                  className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition"
                >
                  수정
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
