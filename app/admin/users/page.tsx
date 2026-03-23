import { prisma } from "@/lib/prisma";
import { UserRoleToggle } from "@/components/admin/UserRoleToggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string })?.id;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, role: true, createdAt: true,
      _count: { select: { progress: true } },
    },
  });

  return (
    <main className="px-4 md:px-8 py-8 pb-24 lg:pb-8 max-w-5xl mx-auto">
      <div className="mb-10 animate-fade-up">
        <h1 className="font-display text-4xl font-bold mb-1" style={{ color: "#e8e4d9" }}>Users</h1>
        <p style={{ color: "#6b7280" }}>{users.length} registered users</p>
      </div>

      <div className="rounded-2xl overflow-hidden animate-fade-up-2" style={{ border: "1px solid #1e2540" }}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-bold uppercase tracking-widest"
          style={{ background: "#0d1021", borderBottom: "1px solid #1e2540", color: "#6b7280" }}>
          <div className="col-span-5">User</div>
          <div className="col-span-2 hidden md:block">Modules Done</div>
          <div className="col-span-2 hidden md:block">Joined</div>
          <div className="col-span-3 md:col-span-3">Role</div>
        </div>

        {users.map((user, i) => (
          <div key={user.id}
            className="grid grid-cols-12 gap-4 px-5 py-4 items-center"
            style={{ background: i % 2 === 0 ? "#0d1021" : "#0a0e1a", borderBottom: "1px solid #1e2540" }}>
            <div className="col-span-5 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#e8e4d9" }}>{user.name ?? "—"}</p>
              <p className="text-xs truncate" style={{ color: "#6b7280" }}>{user.email}</p>
            </div>
            <div className="col-span-2 hidden md:block">
              <span className="text-sm" style={{ color: "#6b7280" }}>{user._count.progress}</span>
            </div>
            <div className="col-span-2 hidden md:block">
              <span className="text-xs" style={{ color: "#6b7280" }}>
                {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="col-span-3">
              {user.id === currentUserId ? (
                <span className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "#c49a3c22", color: "#c49a3c" }}>
                  {user.role} (you)
                </span>
              ) : (
                <UserRoleToggle userId={user.id} currentRole={user.role} />
              )}
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="px-5 py-10 text-center" style={{ color: "#6b7280" }}>No users yet.</div>
        )}
      </div>
    </main>
  );
}
