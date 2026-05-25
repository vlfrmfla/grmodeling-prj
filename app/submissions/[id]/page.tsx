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
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← 갤러리로 돌아가기
      </Link>

      {s.thumbnail_url && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
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
            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {s.category}
            </span>
          )}
          <h1 className="text-2xl font-bold mt-2">{s.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {s.profiles?.name ?? "익명"}
            {s.profiles?.department ? ` · ${s.profiles.department}` : ""} ·{" "}
            {new Date(s.created_at).toLocaleDateString("ko-KR")}
          </p>
        </div>
        <a
          href={s.service_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          방문하기 ↗
        </a>
      </div>

      <p className="whitespace-pre-wrap text-[15px] leading-7 text-neutral-800 dark:text-neutral-200">
        {s.description}
      </p>

      {s.tech_stack && s.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {s.tech_stack.map((t) => (
            <span
              key={t}
              className="text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <Link
            href={`/submissions/${s.id}/edit`}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            수정
          </Link>
          <DeleteButton id={s.id} />
        </div>
      )}
    </article>
  );
}
