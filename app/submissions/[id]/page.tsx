import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Submission } from "@/lib/schemas";
import DeleteButton from "./DeleteButton";

export default async function SubmissionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("submissions")
    .select(
      "id, user_id, title, service_url, description, category, tech_stack, thumbnail_url, created_at, updated_at, profiles(name, department)",
    )
    .eq("id", id)
    .single();

  if (error || !data) notFound();
  const s = data as unknown as Submission;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === s.user_id;

  return (
    <article className="mx-auto max-w-3xl space-y-7">
      <Link
        href="/"
        className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition"
      >
        ← 갤러리로 돌아가기
      </Link>

      {s.thumbnail_url && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800">
          <Image
            src={s.thumbnail_url}
            alt={s.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          {s.category && (
            <span className="inline-block text-[10.5px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              {s.category}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-3">
            {s.title}
          </h1>
          <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">
            {s.profiles?.name ?? "익명"}
            {s.profiles?.department ? ` · ${s.profiles.department}` : ""} ·{" "}
            {new Date(s.created_at).toLocaleDateString("ko-KR")}
          </p>
        </div>
        <a
          href={s.service_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary shrink-0"
        >
          방문하기 ↗
        </a>
      </div>

      <p className="whitespace-pre-wrap text-[15px] leading-7 text-stone-700 dark:text-stone-200">
        {s.description}
      </p>

      {s.tech_stack && s.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {s.tech_stack.map((t) => (
            <span
              key={t}
              className="text-xs rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2.5 py-1"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-2 pt-5 border-t border-stone-200 dark:border-stone-800">
          <Link href={`/submissions/${s.id}/edit`} className="btn-ghost">
            수정
          </Link>
          <DeleteButton id={s.id} />
        </div>
      )}
    </article>
  );
}
