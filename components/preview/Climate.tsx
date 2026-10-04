"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import { playChime } from "../Journey";
import type { PreviewStrings } from "@/lib/preview-strings";

interface Props {
  s: PreviewStrings;
  onSpeak: (text: string) => void;
}

const tap = { scale: 0.97, transition: { duration: 0.1 } };

export default function Climate({ s, onSpeak }: Props) {
  const [temp, setTemp] = useState<"warm" | "cold" | null>(null);

  function select(next: "warm" | "cold") {
    if (temp === next) {
      setTemp(null);
      onSpeak("Temperature request cancelled.");
      return;
    }
    setTemp(next);
    playChime(next);
    setTimeout(() => {
      onSpeak(
        next === "warm"
          ? "Amish, can you put the warm temperature, please?"
          : "Amish, can you put the cold temperature, please?"
      );
    }, 700);
  }

  const options = [
    { id: "warm" as const, icon: "flame" as const,     color: "var(--icon-orange)", label: s.warmer },
    { id: "cold" as const, icon: "snowflake" as const, color: "var(--icon-sky)",    label: s.cooler },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(({ id, icon, color, label }) => (
        <motion.button
          key={id}
          whileTap={tap}
          className="bx-tile bx-tile--row"
          style={{ minHeight: 72 }}
          aria-pressed={temp === id}
          onClick={() => select(id)}
        >
          <Icon name={icon} size={24} style={{ color, flexShrink: 0 }} />
          <span className="bx-label">{label}</span>
          {temp === id && (
            <span className="bx-status ms-auto">
              <Icon name="check" size={14} />
              {s.toldAmish}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
