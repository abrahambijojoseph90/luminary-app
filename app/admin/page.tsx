import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const [moduleCount, userCount, progressCount, unpublishedCount] = await Promise.all([
    prisma.module.count(),
    prisma.user.count(),
    prisma.userProgress.count(),
    prisma.module.count({ where: { published: false } }),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const stats = [
    { label: "Total Modules",    value: moduleCount,    color: "#c49a3c", href: "/admin/modules" },
    { label: "Unpublished",      value: unpublishedCount, color: "#ff8c69", href: "/admin/modules" },
    { label: "Registered Users", value: userCount,      color: "#6eb5ff", href: "/admin/users" },
    { label: "Completions",      value: progressCount,  color: "#7defa8", href: null },
  ];

  return (
    <main className="px-4 md:px-8 py-8 pb-24 lg:pb-8 max-w-5xl mx-auto">
      <div className="mb-10 animate-fade-up">
        <h1 className="font-display text-4xl font-bold mb-1" style={{ color: "#e8e4d9" }}>Admin Overview</h1>
        <p style={{ color: "#6b7280" }}>Manage modules, content, and users.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up-2">
        {stats.map((s) => (
          <div key={s.label}
            className="rounded-2xl p-5 transition-all"
            style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>{s.label}</p>
            <p className="text-3xl font-bold font-ui" style={{ color: s.color }}>{s.value}</p>
            {s.href && (
              <Link href={s.href} className="text-xs mt-2 block hover:opacity-80" style={{ color: "#3a4060" }}>
                View →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8 animate-fade-up-3">
        <Link href="/admin/modules/new"
          className="rounded-2xl p-6 flex items-center gap-4 transition-all hover:-translate-y-0.5"
          style={{ background: "#0d1021", border: "1px solid #c49a3c33" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "#c49a3c22" }}>+</div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#e8e4d9" }}>Create New Module</p>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Add a new training module with content</p>
          </div>
        </Link>

        <Link href="/admin/users"
          className="rounded-2xl p-6 flex items-center gap-4 transition-all hover:-translate-y-0.5"
          style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "#6eb5ff22" }}>◉</div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#e8e4d9" }}>Manage Users</p>
            <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>Promote users to admin or view activity</p>
          </div>
        </Link>
      </div>

      {/* Recent users */}
      <div className="rounded-2xl p-6 animate-fade-up-4" style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-widest" style={{ color: "#6b7280" }}>Recent Registrations</p>
          <Link href="/admin/users" className="text-xs" style={{ color: "#c49a3c" }}>View all →</Link>
        </div>
        <div className="space-y-3">
          {recentUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #1e2540" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "#e8e4d9" }}>{u.name ?? "—"}</p>
                <p className="text-xs" style={{ color: "#6b7280" }}>{u.email}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full"
                style={{ background: u.role === "ADMIN" ? "#c49a3c22" : "#1e2540", color: u.role === "ADMIN" ? "#c49a3c" : "#6b7280" }}>
                {u.role}
              </span>
            </div>
          ))}
          {recentUsers.length === 0 && (
            <p className="text-sm" style={{ color: "#6b7280" }}>No users yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
