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
      className="group block overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800">
        {s.thumbnail_url ? (
          <Image
            src={s.thumbnail_url}
            alt={s.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            🌾
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        {s.category && (
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            {s.category}
          </span>
        )}
        <h3 className="font-semibold text-base leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 line-clamp-2">
          {s.title}
        </h3>
        {s.tech_stack && s.tech_stack.length > 0 && (
          <p className="text-xs text-neutral-500 line-clamp-1">
            {s.tech_stack.join(" · ")}
          </p>
        )}
        <p className="text-xs text-neutral-500">
          {s.profiles?.name ?? "익명"} ·{" "}
          {new Date(s.created_at).toLocaleDateString("ko-KR")}
        </p>
      </div>
    </a>
  );
}
