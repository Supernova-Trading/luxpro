"use client";

interface Props {
  speaking: boolean;
  text: string;
}

export default function VoiceBar({ speaking, text }: Props) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center gap-4 px-5 py-2"
      style={{
        background:
          "linear-gradient(90deg, var(--prim-obsidian-900), var(--prim-obsidian-800), var(--prim-obsidian-900))",
        borderBottom: "1px solid rgba(200,168,75,0.18)",
        boxShadow: speaking ? "0 2px 12px rgba(200,168,75,0.10)" : undefined,
        transition: "box-shadow 400ms ease",
      }}
    >
      <Waveform speaking={speaking} />
      <div
        className="text-[11px] tracking-[3px] uppercase font-semibold"
        style={{ color: speaking ? "var(--lp-gold)" : "rgba(255,255,255,0.45)" }}
      >
        {text}
      </div>
      <Waveform speaking={speaking} />
    </div>
  );
}

// 7-bar diamond-profile waveform
function Waveform({ speaking }: { speaking: boolean }) {
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 18 }}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className={`wave-bar${speaking ? " speaking" : ""}`}
        />
      ))}
    </div>
  );
}
