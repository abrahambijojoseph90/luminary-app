import Link from "next/link";

interface ModuleCardProps {
  module: {
    id: number;
    title: string;
    subtitle: string;
    type: string;
    duration: string;
    category: string;
    categoryColor: string;
    excerpt: string;
  };
  completed: boolean;
}

export function ModuleCard({ module, completed }: ModuleCardProps) {
  return (
    <Link href={`/modules/${module.id}`} className="block group">
      <div
        className="rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1"
        style={{
          background: "#0d1021",
          border: completed ? "1px solid #c49a3c44" : "1px solid #1e2540",
          boxShadow: completed ? "0 0 20px #c49a3c11" : "none",
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: module.categoryColor + "22", color: module.categoryColor }}>
            {module.category}
          </span>
          {completed ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#c49a3c22", color: "#c49a3c" }}>
              ✓ Done
            </span>
          ) : (
            <span className="text-xs" style={{ color: "#3a4060" }}>
              {module.type === "video" ? "▶" : "≡"} {module.duration}
            </span>
          )}
        </div>

        <h3 className="font-display font-semibold text-lg leading-snug mb-1" style={{ color: "#e8e4d9" }}>
          {module.title}
        </h3>
        <p className="text-xs mb-3" style={{ color: "#6b7280" }}>{module.subtitle}</p>
        <p className="text-sm leading-relaxed" style={{ color: "#8892a4" }}>{module.excerpt}</p>

        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid #1e2540" }}>
          <span className="text-xs" style={{ color: "#3a4060" }}>
            {module.type === "video" ? "▶ Video" : "≡ Article"} · {module.duration}
          </span>
          <span className="text-xs font-semibold transition-transform group-hover:translate-x-1" style={{ color: "#c49a3c" }}>
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}
