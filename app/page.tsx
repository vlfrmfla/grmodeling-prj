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
      <section className="mb-8">
        <h1 className="text-2xl font-bold">학생들의 농업 서비스 모음</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          카드를 누르면 학생이 배포한 서비스로 바로 이동합니다.
        </p>
      </section>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          데이터를 불러오는 중 오류가 발생했습니다: {error.message}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center text-neutral-500">
          아직 등록된 과제가 없습니다. 첫 번째 카드를 올려보세요!
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
