"use client";
import { SKILLS, type SkillId } from "@/lib/modules-data";

interface SkillBarProps {
  skillLevels: Record<SkillId, number>;
}

export function SkillBar({ skillLevels }: SkillBarProps) {
  return (
    <div className="space-y-3">
      {SKILLS.map((skill) => {
        const pct = skillLevels[skill.id] ?? 0;
        return (
          <div key={skill.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: skill.color }}>
                {skill.label}
              </span>
              <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1e2540" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${pct}%`, background: skill.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
