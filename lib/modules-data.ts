// Shared types used across the app
export type ModuleType = "article" | "video";

export type SkillId =
  | "vision"
  | "servanthood"
  | "communication"
  | "wisdom"
  | "resilience"
  | "discipleship";

export interface Skill {
  id: SkillId;
  label: string;
  color: string;
}

export const SKILLS: Skill[] = [
  { id: "vision",        label: "Vision",        color: "#6eb5ff" },
  { id: "servanthood",   label: "Servanthood",   color: "#c49a3c" },
  { id: "communication", label: "Communication", color: "#7defa8" },
  { id: "wisdom",        label: "Wisdom",        color: "#d97aff" },
  { id: "resilience",    label: "Resilience",    color: "#ff8c69" },
  { id: "discipleship",  label: "Discipleship",  color: "#5bc4f5" },
];

export interface Phase {
  id: number;
  label: string;
  name: string;
  color: string;
}

export const PHASES: Phase[] = [
  { id: 1, label: "Phase 1", name: "Foundation", color: "#c49a3c" },
  { id: 2, label: "Phase 2", name: "Growth",     color: "#6eb5ff" },
  { id: 3, label: "Phase 3", name: "Mastery",    color: "#7defa8" },
];

// DB module shape (mirrors Prisma Module model)
export interface DbModule {
  id: number;
  phase: number;
  title: string;
  subtitle: string;
  type: string;
  duration: string;
  skills: Record<string, number>;
  category: string;
  categoryColor: string;
  excerpt: string;
  videoUrl: string | null;
  content: { heading: string; body: string }[];
  order: number;
  published: boolean;
}

export function computeSkillLevels(
  modules: DbModule[],
  completedModuleIds: number[]
): Record<SkillId, number> {
  const totals: Record<SkillId, number> = {
    vision: 0, servanthood: 0, communication: 0,
    wisdom: 0, resilience: 0, discipleship: 0,
  };
  const maxPossible: Record<SkillId, number> = {
    vision: 0, servanthood: 0, communication: 0,
    wisdom: 0, resilience: 0, discipleship: 0,
  };

  modules.forEach((m) => {
    Object.entries(m.skills).forEach(([skill, val]) => {
      const s = skill as SkillId;
      if (!(s in maxPossible)) return;
      maxPossible[s] += val ?? 0;
      if (completedModuleIds.includes(m.id)) totals[s] += val ?? 0;
    });
  });

  const result = {} as Record<SkillId, number>;
  (Object.keys(totals) as SkillId[]).forEach((s) => {
    result[s] = maxPossible[s] > 0 ? Math.round((totals[s] / maxPossible[s]) * 100) : 0;
  });
  return result;
}
