import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MODULES, PHASES, computeSkillLevels } from "@/lib/modules-data";
import { Navigation } from "@/components/Navigation";
import { RadarMap } from "@/components/RadarMap";
import { SkillBar } from "@/components/SkillBar";

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id?: string }).id!;
  const progressRows = await prisma.userProgress.findMany({ where: { userId } });
  const completedIds = progressRows.map((p) => p.moduleId);
  const skillLevels = computeSkillLevels(completedIds);

  const completedCount = completedIds.length;
  const totalCount = MODULES.length;
  const overallPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen lg:pl-56" style={{ background: "#07090f" }}>
      <Navigation userName={session.user.name} />

      <main className="px-4 md:px-8 py-8 pb-24 lg:pb-8 max-w-5xl mx-auto">
        <div className="mb-10 animate-fade-up">
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: "#e8e4d9" }}>Your Progress</h1>
          <p style={{ color: "#6b7280" }}>A living map of your leadership growth.</p>
        </div>

        {/* Overall ring + radar */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Overall */}
          <div className="rounded-2xl p-8 flex flex-col items-center justify-center animate-fade-up-2"
            style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
            <div className="relative w-40 h-40 mb-6">
              <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                <circle cx="70" cy="70" r="56" fill="none" stroke="#1e2540" strokeWidth="8" />
                <circle
                  cx="70" cy="70" r="56" fill="none"
                  stroke="#c49a3c" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallPct / 100)}`}
                  style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
                />
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

          {/* DNA Radar */}
          <div className="rounded-2xl p-6 flex flex-col items-center animate-fade-up-3"
            style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
            <p className="text-xs uppercase tracking-widest mb-4 self-start" style={{ color: "#6b7280" }}>Leadership DNA</p>
            <RadarMap skillLevels={skillLevels} size={220} />
          </div>
        </div>

        {/* Skills + Phases */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 animate-fade-up-4"
            style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#6b7280" }}>Skill Levels</p>
            <SkillBar skillLevels={skillLevels} />
          </div>

          <div className="rounded-2xl p-6 animate-fade-up-4"
            style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#6b7280" }}>Phase Breakdown</p>
            <div className="space-y-6">
              {PHASES.map((phase) => {
                const done = phase.modules.filter((id) => completedIds.includes(id)).length;
                const pct = Math.round((done / phase.modules.length) * 100);
                return (
                  <div key={phase.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold" style={{ color: phase.color }}>
                        {phase.label}: {phase.name}
                      </span>
                      <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{done}/{phase.modules.length} — {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1e2540" }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%`, background: phase.color }}
                      />
                    </div>
                    {/* Module dots */}
                    <div className="flex gap-2 mt-2">
                      {phase.modules.map((id) => (
                        <div key={id} className="w-2 h-2 rounded-full transition-all"
                          style={{ background: completedIds.includes(id) ? phase.color : "#1e2540" }} />
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
