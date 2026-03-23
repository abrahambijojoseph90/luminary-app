import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ModuleActions } from "@/components/admin/ModuleActions";

export default async function AdminModulesPage() {
  const modules = await prisma.module.findMany({ orderBy: { order: "asc" } });

  const phaseColors: Record<number, string> = { 1: "#c49a3c", 2: "#6eb5ff", 3: "#7defa8" };
  const phaseNames: Record<number, string> = { 1: "Foundation", 2: "Growth", 3: "Mastery" };

  return (
    <main className="px-4 md:px-8 py-8 pb-24 lg:pb-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-10 animate-fade-up">
        <div>
          <h1 className="font-display text-4xl font-bold mb-1" style={{ color: "#e8e4d9" }}>Modules</h1>
          <p style={{ color: "#6b7280" }}>{modules.length} modules total</p>
        </div>
        <Link href="/admin/modules/new"
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 flex-shrink-0"
          style={{ background: "#c49a3c", color: "#07090f" }}>
          + New Module
        </Link>
      </div>

      <div className="space-y-3 animate-fade-up-2">
        {modules.map((mod) => (
          <div key={mod.id} className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "#0d1021", border: `1px solid ${mod.published ? "#1e2540" : "#ff8c6933"}` }}>
            {/* Phase badge */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: (phaseColors[mod.phase] ?? "#c49a3c") + "22", color: phaseColors[mod.phase] ?? "#c49a3c" }}>
              P{mod.phase}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold truncate" style={{ color: "#e8e4d9" }}>{mod.title}</p>
                {!mod.published && (
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: "#ff8c6922", color: "#ff8c69" }}>Draft</span>
                )}
              </div>
              <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                {phaseNames[mod.phase]} · {mod.type === "video" ? "▶ Video" : "≡ Article"} · {mod.duration}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href={`/admin/modules/${mod.id}/edit`}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: "#1e2540", color: "#e8e4d9" }}>
                Edit
              </Link>
              <ModuleActions moduleId={mod.id} published={mod.published} />
            </div>
          </div>
        ))}

        {modules.length === 0 && (
          <div className="text-center py-16" style={{ color: "#6b7280" }}>
            <p className="text-lg mb-4">No modules yet.</p>
            <Link href="/admin/modules/new" className="text-sm" style={{ color: "#c49a3c" }}>Create your first module →</Link>
          </div>
        )}
      </div>
    </main>
  );
}
