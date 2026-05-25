// Public gallery page — server-rendered card grid.
import { createClient } from "@/lib/supabase/server";
import SubmissionCard from "@/components/SubmissionCard";
import type { Submission } from "@/lib/schemas";

export const revalidate = 0; // always fresh

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(
      "id, user_id, title, service_url, description, category, tech_stack, thumbnail_url, created_at, updated_at, profiles(name, department)",
    )
    .order("created_at", { ascending: false });

  const items = (data ?? []) as unknown as Submission[];

  return (
    <div>
      <section className="mb-10">
        <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-2">
          Smart Greenhouse Modeling — 2026 Spring
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          스마트 온실 모델링 이론과 개발
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-stone-600 dark:text-stone-400">
          수강생 프로젝트 모음 — 카드를 누르면 학생이 배포한 서비스로 바로 이동합니다.
        </p>
      </section>

      {error && (
        <div className="rounded-lg border border-red-300/60 bg-red-50/60 dark:bg-red-950/40 dark:border-red-900/60 p-4 text-sm text-red-700 dark:text-red-300">
          데이터를 불러오는 중 오류가 발생했습니다: {error.message}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center text-stone-500 dark:text-stone-400">
          아직 등록된 과제가 없습니다. 첫 번째 카드를 올려보세요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <SubmissionCard key={s.id} s={s} />
          ))}
        </div>
      )}
    </div>
  );
}
