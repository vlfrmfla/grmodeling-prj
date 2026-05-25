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
          <LinkPreview url={s.service_url} alt={s.title} />
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

/**
 * Auto-preview shown when the student didn't upload a thumbnail.
 *
 * Uses WordPress.com's free `mshots` screenshot service. The first request
 * for a given URL queues the screenshot (~30s placeholder); subsequent
 * requests return the cached image instantly.
 *
 * Over the screenshot we always render a small favicon + domain badge so
 * the viewer immediately sees where the card leads — even while the
 * screenshot is still queueing.
 */
function LinkPreview({ url, alt }: { url: string; alt: string }) {
  const shot = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=800&h=450`;
  let domain = "";
  try {
    domain = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // Malformed URL — DomainBadge will render empty and we'll just show
    // the screenshot. Still better than nothing.
  }
  const favicon = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : null;

  return (
    <>
      {/* External screenshot — use a plain <img> so we don't need to
          whitelist s.wordpress.com in next.config.ts. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {domain && (
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 rounded-md bg-white/85 dark:bg-stone-900/85 backdrop-blur-sm px-2 py-1 text-xs">
          {favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={14}
              height={14}
              className="rounded-sm shrink-0"
            />
          )}
          <span className="truncate text-stone-700 dark:text-stone-200">
            {domain}
          </span>
        </div>
      )}
    </>
  );
}
