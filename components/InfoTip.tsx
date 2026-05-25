// Small "i" badge that reveals a hint on hover/focus. Pure CSS tooltip.
export default function InfoTip({ text }: { text: string }) {
  return (
    <span
      className="infotip"
      role="button"
      tabIndex={0}
      aria-label={text}
      // Provide a native fallback for touch devices that don't trigger :hover.
      title={text}
    >
      i
      <span className="infotip-bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}
