"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type Module } from "@/lib/modules-data";

interface ModuleViewerProps {
  module: Module;
  completed: boolean;
}

export function ModuleViewer({ module: mod, completed: initialCompleted }: ModuleViewerProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [unlocked, setUnlocked] = useState(initialCompleted);
  const [celebrating, setCelebrating] = useState(false);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCompleted) return;
    const el = contentRef.current;
    if (!el) return;

    function onScroll() {
      if (!el) return;
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
      if (scrolled >= 0.3) setUnlocked(true);
    }

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [initialCompleted]);

  async function markComplete() {
    if (loading) return;
    setLoading(true);
    await fetch(`/api/progress/${mod.id}`, { method: "POST" });
    setCompleted(true);
    setCelebrating(true);
    setLoading(false);
    setTimeout(() => {
      setCelebrating(false);
      router.refresh();
    }, 2500);
  }

  async function markIncomplete() {
    await fetch(`/api/progress/${mod.id}`, { method: "DELETE" });
    setCompleted(false);
    setUnlocked(true);
    router.refresh();
  }

  return (
    <div className="relative h-screen flex flex-col lg:h-auto lg:min-h-screen">
      {/* Celebration overlay */}
      {celebrating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-fade-up">
            <div className="text-6xl mb-4">◈</div>
            <p className="font-display text-3xl font-bold" style={{ color: "#c49a3c" }}>Module Complete</p>
            <p className="text-sm mt-2" style={{ color: "#6b7280" }}>Your DNA map is growing.</p>
          </div>
          <div className="absolute inset-0" style={{ background: "#07090f99" }} />
        </div>
      )}

      {/* Header */}
      <div className="flex-shrink-0 px-4 md:px-8 py-5" style={{ borderBottom: "1px solid #1e2540" }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/modules" className="text-xs hover:opacity-80 transition-opacity" style={{ color: "#6b7280" }}>
              ← Modules
            </Link>
            <span style={{ color: "#1e2540" }}>/</span>
            <span className="text-xs" style={{ color: "#3a4060" }}>Phase {mod.phase}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: mod.categoryColor + "22", color: mod.categoryColor }}>
                  {mod.category}
                </span>
                <span className="text-xs" style={{ color: "#6b7280" }}>
                  {mod.type === "video" ? "▶" : "≡"} {mod.duration}
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold" style={{ color: "#e8e4d9" }}>
                {mod.title}
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6b7280" }}>{mod.subtitle}</p>
            </div>

            {completed ? (
              <button onClick={markIncomplete}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: "#c49a3c22", color: "#c49a3c", border: "1px solid #c49a3c44" }}>
                ✓ Completed
              </button>
            ) : (
              <button onClick={markComplete} disabled={!unlocked || loading}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: unlocked ? "#c49a3c" : "#1e2540",
                  color: unlocked ? "#07090f" : "#3a4060",
                  cursor: unlocked ? "pointer" : "not-allowed",
                }}>
                {loading ? "Saving..." : unlocked ? "Mark Complete" : "Scroll to unlock"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Video */}
          {mod.type === "video" && mod.videoUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={mod.videoUrl}
                title={mod.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Article content */}
          <div className="prose-luminary">
            {mod.content.map((section, i) => (
              <div key={i}>
                <h3>{section.heading}</h3>
                <p>{section.body}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          {!completed && (
            <div className="mt-12 py-6 text-center" style={{ borderTop: "1px solid #1e2540" }}>
              {unlocked ? (
                <button onClick={markComplete} disabled={loading}
                  className="px-8 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
                  style={{ background: "#c49a3c", color: "#07090f" }}>
                  {loading ? "Saving..." : "Mark as Complete →"}
                </button>
              ) : (
                <p className="text-sm" style={{ color: "#3a4060" }}>Keep reading to unlock completion</p>
              )}
            </div>
          )}

          {completed && (
            <div className="mt-12 py-6 text-center" style={{ borderTop: "1px solid #1e2540" }}>
              <p className="text-sm mb-4" style={{ color: "#6b7280" }}>Module complete. Ready for the next one?</p>
              <Link href="/modules"
                className="inline-flex px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={{ background: "#c49a3c22", color: "#c49a3c", border: "1px solid #c49a3c44" }}>
                Back to Modules →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
