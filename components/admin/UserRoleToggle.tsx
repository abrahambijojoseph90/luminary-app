"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserRoleToggle({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    await fetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button onClick={toggle} disabled={loading}
      className="text-xs px-2.5 py-1.5 rounded-full font-semibold transition-all"
      style={{
        background: currentRole === "ADMIN" ? "#c49a3c22" : "#1e2540",
        color: currentRole === "ADMIN" ? "#c49a3c" : "#6b7280",
        cursor: loading ? "wait" : "pointer",
      }}>
      {loading ? "..." : currentRole === "ADMIN" ? "ADMIN ✕" : "Make Admin"}
    </button>
  );
}
