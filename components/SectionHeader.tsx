interface Props {
  label: string;
}

export default function SectionHeader({ label }: Props) {
  return (
    <div className="mb-4" style={{ borderBottom: "1px solid var(--lp-gold)", paddingBottom: "10px" }}>
      <span
        className="font-cormorant"
        style={{
          fontSize: "clamp(1.125rem, 2.5vw, 1.75rem)",
          letterSpacing: "0.05em",
          fontWeight: 500,
          color: "#ffffff",
        }}
      >
        {label}
      </span>
    </div>
  );
}
