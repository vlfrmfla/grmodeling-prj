import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SubmissionCard from "@/components/SubmissionCard";
import type { Submission } from "@/lib/schemas";

export const metadata = { title: "내 제출물 · 농업 서비스 갤러리" };

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated users, but be defensive.
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">내 제출물</h1>
        <Link
          href="/submissions/new"
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-white text-sm hover:bg-emerald-700"
        >
          + 새 과제
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center text-neutral-500">
          아직 등록한 과제가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <div key={s.id} className="space-y-2">
              <SubmissionCard s={s} />
              <div className="flex gap-2 text-xs">
                <Link
                  href={`/submissions/${s.id}`}
                  className="text-neutral-600 hover:underline"
                >
                  상세
                </Link>
                <Link
                  href={`/submissions/${s.id}/edit`}
                  className="text-neutral-600 hover:underline"
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
