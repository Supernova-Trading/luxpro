"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import { COMFORT, ROUTES, TRACK, LabHeader, useDaypart, useFlash, useTemp, useToggles } from "./shared";

const tap = { scale: 0.98, transition: { duration: 0.1 } };

// Direction B — "Concierge card". The in-room amenity card from the
// hospitality seat: one typeset card, courses under small gold headings,
// guest-facing wording, requests acknowledged in quiet gold italic.
function Course({ title }: { title: string }) {
  return <div className="lab-course">{title}</div>;
}

function Ack({ text }: { text: string }) {
  return <span className="lab-italic" style={{ fontSize: 14, color: "var(--bx-gold)" }}>{text}</span>;
}

export default function MockB() {
  const part = useDaypart();
  const comfort = useToggles();
  const route = useFlash();
  const temp = useTemp(21);
  const [playing, setPlaying] = useState(true);

  return (
    <div className="bx flex flex-col overflow-hidden" style={{ height: "100dvh" }} data-lang="en">
      <LabHeader />
      <main className="flex-1 min-h-0 flex flex-col px-5 pb-4">
        <div className="text-center">
          <h1 className="bx-display">Good {part}, and welcome.</h1>
          <p className="lab-italic mt-1" style={{ fontSize: 18 }}>Anything you need, just ask.</p>
          <p className="lab-italic" style={{ fontSize: 18, color: "var(--bx-gold)" }}>Amish</p>
        </div>

        <div className="lab-card mt-5 flex-1 min-h-0 flex flex-col justify-between px-5 py-5">
          <section>
            <Course title="At your request" />
            <div className="grid grid-cols-2 gap-x-4 mt-2">
              {COMFORT.map((it) => (
                <motion.button key={it.key} whileTap={tap} className="lab-amenity" onClick={() => comfort.toggle(it.key)}>
                  <Icon name={it.icon} size={18} style={{ color: it.color, flexShrink: 0, marginTop: 4 }} />
                  <span className="flex flex-col">
                    <span className="lab-row-label" style={{ fontSize: 19 }}>{it.hosp}</span>
                    {comfort.on[it.key] && <Ack text="Amish has your request" />}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          <section>
            <Course title="The journey" />
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              {ROUTES.map((it) => (
                <motion.button key={it.key} whileTap={tap} className="lab-amenity flex-col items-center" style={{ alignItems: "center" }} onClick={() => route.flash(it.key)}>
                  <Icon name={it.icon} size={18} style={{ color: it.color }} />
                  <span className="lab-row-label" style={{ fontSize: 17, textAlign: "center" }}>{it.hosp}</span>
                  {route.id === it.key && <Ack text="Noted" />}
                </motion.button>
              ))}
            </div>
          </section>

          <section>
            <Course title="The cabin" />
            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="lab-italic" style={{ fontSize: 16 }}>Your preference</div>
                {temp.told ? <Ack text={`Amish has it: ${temp.value}°`} /> : <span className="bx-sub">Cool 19° · Comfortable 21° · Warm 23°</span>}
              </div>
              <div className="flex items-center gap-3">
                <motion.button whileTap={tap} className="lab-step" style={{ width: 52, height: 52 }} onClick={() => temp.step(-1)} aria-label="Cooler">
                  <Icon name="snowflake" size={18} style={{ color: "var(--icon-sky)" }} />
                </motion.button>
                <span className="lab-num" data-told={temp.told} style={{ fontSize: 48, minWidth: 76, textAlign: "center" }}>{temp.value}°</span>
                <motion.button whileTap={tap} className="lab-step" style={{ width: 52, height: 52 }} onClick={() => temp.step(1)} aria-label="Warmer">
                  <Icon name="flame" size={18} style={{ color: "var(--icon-orange)" }} />
                </motion.button>
              </div>
            </div>
          </section>

          <section>
            <Course title="Music" />
            <div className="flex items-center gap-4 mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={TRACK.art} alt="" width={56} height={56} style={{ width: 56, height: 56, objectFit: "cover" }} />
              <div className="flex-1 min-w-0">
                <div className="lab-row-label truncate">{TRACK.title}</div>
                <div className="lab-italic truncate" style={{ fontSize: 14, color: "var(--bx-muted)" }}>{TRACK.artist} · Our playlists · Radio · Your phone</div>
              </div>
              <motion.button whileTap={tap} className="lab-step" style={{ width: 52, height: 52, color: "var(--bx-gold)", borderColor: "var(--bx-gold)" }} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
                <Icon name={playing ? "pause" : "play"} size={18} />
              </motion.button>
            </div>
          </section>

          <section className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid color-mix(in oklch, var(--bx-gold) 35%, transparent)" }}>
            <button className="lab-link" style={{ minHeight: 44 }}>
              <span className="flex items-center gap-2"><Icon name="gamepad" size={18} style={{ color: "var(--icon-violet)" }} /><span className="lab-italic" style={{ fontSize: 18 }}>Diversions</span></span>
            </button>
            <button className="lab-link" style={{ minHeight: 44 }}>
              <span className="flex items-center gap-2"><Icon name="cash" size={18} style={{ color: "var(--accent-positive)" }} /><span className="lab-italic" style={{ fontSize: 18 }}>Thank Amish</span></span>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
