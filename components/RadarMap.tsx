"use client";
import { useMemo } from "react";
import { SKILLS, type SkillId } from "@/lib/modules-data";

interface RadarMapProps {
  skillLevels: Record<SkillId, number>;
  size?: number;
}

export function RadarMap({ skillLevels, size = 220 }: RadarMapProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;
  const levels = [0.25, 0.5, 0.75, 1];
  const n = SKILLS.length;

  const angles = useMemo(
    () => SKILLS.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2),
    [n]
  );

  function point(r: number, angle: number) {
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const gridPoints = levels.map((l) =>
    angles.map((a) => point(maxR * l, a))
  );

  const skillPoints = angles.map((a, i) => {
    const pct = (skillLevels[SKILLS[i].id] ?? 0) / 100;
    return point(maxR * Math.max(0.05, pct), a);
  });

  const polygon = skillPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {gridPoints.map((pts, li) => (
        <polygon
          key={li}
          points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#1e2540"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {angles.map((a, i) => {
        const outer = point(maxR, a);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={outer.x} y2={outer.y}
            stroke="#1e2540"
            strokeWidth="1"
          />
        );
      })}

      {/* Skill polygon */}
      <polygon
        points={polygon}
        fill="#c49a3c18"
        stroke="#c49a3c"
        strokeWidth="1.5"
        style={{ transition: "all 1s cubic-bezier(.4,0,.2,1)" }}
      />

      {/* Skill dots */}
      {skillPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y} r="3"
          fill={SKILLS[i].color}
          style={{ transition: "all 1s cubic-bezier(.4,0,.2,1)" }}
        />
      ))}

      {/* Labels */}
      {angles.map((a, i) => {
        const labelR = maxR + 18;
        const lp = point(labelR, a);
        const anchor =
          Math.abs(lp.x - cx) < 5 ? "middle" : lp.x > cx ? "start" : "end";
        return (
          <text
            key={i}
            x={lp.x} y={lp.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="9"
            fontFamily="Syne, sans-serif"
            fontWeight="600"
            fill={SKILLS[i].color}
            opacity="0.85"
          >
            {SKILLS[i].label.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}
