"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ModuleActions({ moduleId, published }: { moduleId: number; published: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function togglePublish() {
    setLoading(true);
    await fetch(`/api/admin/modules/${moduleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this module? This cannot be undone.")) return;
    setLoading(true);
    await fetch(`/api/admin/modules/${moduleId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <>
      <button onClick={togglePublish} disabled={loading}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{ background: published ? "#1e2540" : "#c49a3c22", color: published ? "#6b7280" : "#c49a3c" }}>
        {loading ? "..." : published ? "Unpublish" : "Publish"}
      </button>
      <button onClick={handleDelete} disabled={loading}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{ background: "#ff4d4d11", color: "#ff8080" }}>
        Delete
      </button>
    </>
  );
}
