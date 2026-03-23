import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MODULES, PHASES, computeSkillLevels } from "@/lib/modules-data";
import { Navigation } from "@/components/Navigation";
import { RadarMap } from "@/components/RadarMap";
import { SkillBar } from "@/components/SkillBar";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id?: string }).id!;
  const progressRows = await prisma.userProgress.findMany({ where: { userId } });
  const completedIds = progressRows.map((p) => p.moduleId);
  const skillLevels = computeSkillLevels(completedIds);

  const completedCount = completedIds.length;
  const totalCount = MODULES.length;
  const overallPct = Math.round((completedCount / totalCount) * 100);

  // Next recommended module
  const nextModule = MODULES.find((m) => !completedIds.includes(m.id));

  // Current phase
  const currentPhase = PHASES.find((ph) => ph.modules.some((id) => !completedIds.includes(id))) ?? PHASES[PHASES.length - 1];

  const firstName = session.user.name?.split(" ")[0] ?? "Leader";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen lg:pl-56" style={{ background: "#07090f" }}>
      <Navigation userName={session.user.name} />

      <main className="px-4 md:px-8 py-8 pb-24 lg:pb-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="text-sm mb-1" style={{ color: "#6b7280" }}>{greeting},</p>
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: "#e8e4d9" }}>
            {firstName}.
          </h1>
          <p style={{ color: "#6b7280" }}>
            {completedCount === 0
              ? "Your leadership journey begins here."
              : completedCount === totalCount
              ? "You've completed all modules. Remarkable."
              : `${completedCount} of ${totalCount} modules complete — keep going.`}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 animate-fade-up-2">
              {[
                { label: "Completed", value: completedCount, suffix: `/ ${totalCount}` },
                { label: "Overall", value: overallPct, suffix: "%" },
                { label: "Phase", value: currentPhase.id, suffix: `— ${currentPhase.name}` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl p-4"
                  style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>{stat.label}</p>
                  <p className="text-2xl font-bold font-ui" style={{ color: "#e8e4d9" }}>
                    {stat.value}
                    <span className="text-sm font-normal ml-1" style={{ color: "#6b7280" }}>{stat.suffix}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Next module CTA */}
            {nextModule && (
              <div className="rounded-2xl p-6 animate-fade-up-3"
                style={{ background: "#0d1021", border: "1px solid #c49a3c33", boxShadow: "0 0 30px #c49a3c11" }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#c49a3c" }}>
                  ↗ Up Next
                </p>
                <h2 className="font-display text-2xl font-semibold mb-1" style={{ color: "#e8e4d9" }}>
                  {nextModule.title}
                </h2>
                <p className="text-sm mb-4" style={{ color: "#6b7280" }}>{nextModule.subtitle}</p>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#8892a4" }}>{nextModule.excerpt}</p>
                <Link href={`/modules/${nextModule.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                  style={{ background: "#c49a3c", color: "#07090f" }}>
                  {nextModule.type === "video" ? "▶ Watch" : "≡ Read"} Module →
                </Link>
              </div>
            )}

            {/* Phase overview */}
            <div className="rounded-2xl p-6 animate-fade-up-4" style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>Phase Progress</p>
              <div className="space-y-4">
                {PHASES.map((phase) => {
                  const done = phase.modules.filter((id) => completedIds.includes(id)).length;
                  const pct = Math.round((done / phase.modules.length) * 100);
                  return (
                    <div key={phase.id}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-semibold" style={{ color: phase.color }}>
                          {phase.label}: {phase.name}
                        </span>
                        <span className="text-xs font-mono" style={{ color: "#6b7280" }}>{done}/{phase.modules.length}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1e2540" }}>
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%`, background: phase.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column — DNA map */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6 animate-fade-up-2"
              style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>Leadership DNA</p>
              <div className="flex justify-center mb-4">
                <RadarMap skillLevels={skillLevels} size={200} />
              </div>
            </div>

            <div className="rounded-2xl p-6 animate-fade-up-3"
              style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>Skill Breakdown</p>
              <SkillBar skillLevels={skillLevels} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
