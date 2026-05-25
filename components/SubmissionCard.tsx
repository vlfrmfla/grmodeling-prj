// Card rendered in the public gallery. Whole card is a link that opens
// the student's deployed service in a new tab.
import Image from "next/image";
import type { Submission } from "@/lib/schemas";

export default function SubmissionCard({ s }: { s: Submission }) {
  return (
    <a
      href={s.service_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/40 transition hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-sm hover:-translate-y-0.5"
    >
      <div className="relative aspect-video bg-stone-100 dark:bg-stone-800">
        {s.thumbnail_url ? (
          <Image
            src={s.thumbnail_url}
            alt={s.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-stone-400 dark:text-stone-600">
            ◌
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        {s.category && (
          <span className="inline-block text-[10.5px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            {s.category}
          </span>
        )}
        <h3 className="font-medium text-[15px] leading-snug line-clamp-2">
          {s.title}
        </h3>
        {s.tech_stack && s.tech_stack.length > 0 && (
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
            {s.tech_stack.join(" · ")}
          </p>
        )}
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {s.profiles?.name ?? "익명"} ·{" "}
          {new Date(s.created_at).toLocaleDateString("ko-KR")}
        </p>
      </div>
    </a>
  );
}
