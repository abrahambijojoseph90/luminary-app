import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PHASES } from "@/lib/modules-data";
import { Navigation } from "@/components/Navigation";
import { ModuleCard } from "@/components/ModuleCard";

export default async function ModulesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id?: string }).id!;

  const [modules, progressRows] = await Promise.all([
    prisma.module.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.userProgress.findMany({ where: { userId } }),
  ]);

  const completedIds = progressRows.map((p) => p.moduleId);

  return (
    <div className="min-h-screen lg:pl-56" style={{ background: "#07090f" }}>
      <Navigation userName={session.user.name} />

      <main className="px-4 md:px-8 py-8 pb-24 lg:pb-8 max-w-5xl mx-auto">
        <div className="mb-10 animate-fade-up">
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: "#e8e4d9" }}>Modules</h1>
          <p style={{ color: "#6b7280" }}>{completedIds.length} of {modules.length} complete</p>
        </div>

        <div className="space-y-10">
          {PHASES.map((phase, pi) => {
            const phaseModules = modules.filter((m) => m.phase === phase.id);
            if (phaseModules.length === 0) return null;
            return (
              <div key={phase.id} className={pi === 0 ? "animate-fade-up-2" : pi === 1 ? "animate-fade-up-3" : "animate-fade-up-4"}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: phase.color + "22", color: phase.color, border: `1px solid ${phase.color}44` }}>
                    {phase.id}
                  </div>
                  <h2 className="font-ui font-semibold text-sm uppercase tracking-widest" style={{ color: phase.color }}>
                    {phase.label}: {phase.name}
                  </h2>
                  <div className="flex-1 h-px" style={{ background: phase.color + "22" }} />
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {phaseModules.map((mod) => (
                    <ModuleCard key={mod.id} module={mod} completed={completedIds.includes(mod.id)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
