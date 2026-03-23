import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PHASES, computeSkillLevels, type DbModule } from "@/lib/modules-data";
import { Navigation } from "@/components/Navigation";
import { RadarMap } from "@/components/RadarMap";
import { SkillBar } from "@/components/SkillBar";

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id?: string }).id!;

  const [modules, progressRows] = await Promise.all([
    prisma.module.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.userProgress.findMany({ where: { userId } }),
  ]);

  const dbModules = modules.map((m) => ({ ...m, skills: m.skills as Record<string, number>, content: m.content as { heading: string; body: string }[] })) as DbModule[];
  const completedIds = progressRows.map((p) => p.moduleId);
  const skillLevels = computeSkillLevels(dbModules, completedIds);

  const completedCount = completedIds.length;
  const totalCount = dbModules.length;
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen lg:pl-56" style={{ background: "#07090f" }}>
      <Navigation userName={session.user.name} />

      <main className="px-4 md:px-8 py-8 pb-24 lg:pb-8 max-w-5xl mx-auto">
        <div className="mb-10 animate-fade-up">
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: "#e8e4d9" }}>Your Progress</h1>
          <p style={{ color: "#6b7280" }}>A living map of your leadership growth.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Overall ring */}
          <div className="rounded-2xl p-8 flex flex-col items-center justify-center animate-fade-up-2"
            style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
            <div className="relative w-40 h-40 mb-6">
              <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                <circle cx="70" cy="70" r="56" fill="none" stroke="#1e2540" strokeWidth="8" />
                <circle cx="70" cy="70" r="56" fill="none" stroke="#c49a3c" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallPct / 100)}`}
                  style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-ui text-3xl font-bold" style={{ color: "#e8e4d9" }}>{overallPct}%</span>
                <span className="text-xs" style={{ color: "#6b7280" }}>complete</span>
              </div>
            </div>
            <p className="font-ui text-sm font-semibold uppercase tracking-widest" style={{ color: "#6b7280" }}>
              {completedCount} / {totalCount} Modules
            </p>
          </div>

          {/* Radar */}
          <div className="rounded-2xl p-6 flex flex-col items-center animate-fade-up-3"
            style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
            <p className="text-xs uppercase tracking-widest mb-4 self-start" style={{ color: "#6b7280" }}>Leadership DNA</p>
            <RadarMap skillLevels={skillLevels} size={220} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 animate-fade-up-4" style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#6b7280" }}>Skill Levels</p>
            <SkillBar skillLevels={skillLevels} />
          </div>

          <div className="rounded-2xl p-6 animate-fade-up-4" style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#6b7280" }}>Phase Breakdown</p>
            <div className="space-y-6">
              {PHASES.map((phase) => {
                const phaseModules = dbModules.filter((m) => m.phase === phase.id);
                const done = phaseModules.filter((m) => completedIds.includes(m.id)).length;
                const pct = phaseModules.length > 0 ? Math.round((done / phaseModules.length) * 100) : 0;
                return (
                  <div key={phase.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold" style={{ color: phase.color }}>{phase.label}: {phase.name}</span>
                      <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{done}/{phaseModules.length} — {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1e2540" }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: phase.color }} />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {phaseModules.map((m) => (
                        <div key={m.id} className="w-2 h-2 rounded-full transition-all"
                          style={{ background: completedIds.includes(m.id) ? phase.color : "#1e2540" }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
