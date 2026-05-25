// Hover/focus tooltip rendered next to a form label. Uses the Lucide
// Info icon for the trigger; the bubble is positioned via CSS in globals.css.
import { Info } from "lucide-react";

export default function InfoTip({ text }: { text: string }) {
  return (
    <span
      className="infotip"
      role="button"
      tabIndex={0}
      aria-label={text}
      title={text /* native fallback for touch + screen readers */}
    >
      <Info size={14} strokeWidth={2} aria-hidden="true" />
      <span className="infotip-bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}
