import Link from "next/link";

const VARIANTS = [
  { id: "a", name: "A · Instrument", desc: "Your temperature is the big number. Requests in one clean tray of rows." },
  { id: "b", name: "B · Concierge card", desc: "Like a hotel amenity card: serif type, gold rules, no boxes, hospitality wording." },
  { id: "c", name: "C · Image-led", desc: "The album art fills the top. Amish has a presence. Round buttons and one route switch." },
];

// Overview: links for the tablet; on a wide screen, the three side by side
// at the real 640×968 size scaled to fit.
export default function LabIndex() {
  return (
    <div className="bx" style={{ minHeight: "100dvh" }} data-lang="en">
      <div className="px-5 py-6" style={{ maxWidth: 1600, margin: "0 auto" }}>
        <h1 className="bx-display">Pick a direction</h1>
        <p className="bx-title mt-1" style={{ color: "var(--bx-muted)", fontWeight: 400 }}>
          Same content, three different looks. Open each on the tablet and tap around.
        </p>

        <div className="mt-6 flex flex-col gap-2" style={{ maxWidth: 600 }}>
          {VARIANTS.map((v) => (
            <Link key={v.id} href={`/lab/${v.id}`} className="bx-tile bx-tile--row" style={{ textDecoration: "none", minHeight: 80 }}>
              <span className="flex flex-col">
                <span className="bx-title">{v.name}</span>
                <span className="bx-sub">{v.desc}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="lab-compare gap-6 mt-10">
          {VARIANTS.map((v) => (
            <div key={v.id}>
              <div className="bx-caption mb-2">{v.name}</div>
              <div style={{ width: 640 * 0.72, height: 968 * 0.72, overflow: "hidden", border: "1px solid var(--bx-hairline)" }}>
                <iframe
                  src={`/lab/${v.id}`}
                  title={v.name}
                  style={{ width: 640, height: 968, border: 0, transform: "scale(0.72)", transformOrigin: "top left" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
