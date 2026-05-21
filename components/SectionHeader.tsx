interface Props {
  label: string;
}

export default function SectionHeader({ label }: Props) {
  return (
    <div className="flex items-center gap-3 mb-2.5">
      <div className="text-[13px] tracking-[4px] text-white uppercase font-bold whitespace-nowrap">
        {label}
      </div>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(255,255,255,0.2),transparent)" }} />
    </div>
  );
}
