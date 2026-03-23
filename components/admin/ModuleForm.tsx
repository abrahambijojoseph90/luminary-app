"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SKILLS = ["vision", "servanthood", "communication", "wisdom", "resilience", "discipleship"];
const SKILL_LABELS: Record<string, string> = {
  vision: "Vision", servanthood: "Servanthood", communication: "Communication",
  wisdom: "Wisdom", resilience: "Resilience", discipleship: "Discipleship",
};

interface ContentSection { heading: string; body: string; }
interface FormData {
  title: string; subtitle: string; type: string; duration: string;
  phase: string; category: string; categoryColor: string; excerpt: string;
  videoUrl: string; published: boolean;
  skills: Record<string, number>;
  content: ContentSection[];
}

interface ModuleFormProps {
  initial?: Partial<FormData> & { id?: number };
  mode: "create" | "edit";
}

const DEFAULTS: FormData = {
  title: "", subtitle: "", type: "article", duration: "",
  phase: "1", category: "", categoryColor: "#c49a3c", excerpt: "",
  videoUrl: "", published: true,
  skills: { vision: 0, servanthood: 0, communication: 0, wisdom: 0, resilience: 0, discipleship: 0 },
  content: [{ heading: "", body: "" }],
};

export function ModuleForm({ initial, mode }: ModuleFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...DEFAULTS, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof FormData, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function setSkill(skill: string, value: number) {
    setForm((f) => ({ ...f, skills: { ...f.skills, [skill]: value } }));
  }

  function addSection() {
    setForm((f) => ({ ...f, content: [...f.content, { heading: "", body: "" }] }));
  }

  function removeSection(i: number) {
    setForm((f) => ({ ...f, content: f.content.filter((_, idx) => idx !== i) }));
  }

  function updateSection(i: number, field: keyof ContentSection, value: string) {
    setForm((f) => {
      const content = [...f.content];
      content[i] = { ...content[i], [field]: value };
      return { ...f, content };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const url = mode === "create" ? "/api/admin/modules" : `/api/admin/modules/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Something went wrong."); setSaving(false); return; }

    router.push("/admin/modules");
    router.refresh();
  }

  const inputStyle = {
    background: "#111828", border: "1px solid #1e2540", color: "#e8e4d9",
    borderRadius: "12px", padding: "10px 14px", width: "100%", outline: "none",
    fontSize: "0.875rem",
  };
  const labelStyle = { display: "block", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#6b7280", marginBottom: "6px" };
  const sectionStyle = { background: "#0d1021", border: "1px solid #1e2540", borderRadius: "16px", padding: "20px" };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic info */}
      <div style={sectionStyle}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c49a3c" }}>Basic Info</p>
        <div className="space-y-4">
          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} required placeholder="Module title" />
          </div>
          <div>
            <label style={labelStyle}>Subtitle *</label>
            <input style={inputStyle} value={form.subtitle} onChange={e => set("subtitle", e.target.value)} required placeholder="Short descriptor shown under the title" />
          </div>
          <div>
            <label style={labelStyle}>Excerpt *</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} required placeholder="1-2 sentence description shown on the module card" />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div style={sectionStyle}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c49a3c" }}>Settings</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label style={labelStyle}>Phase *</label>
            <select style={inputStyle} value={form.phase} onChange={e => set("phase", e.target.value)}>
              <option value="1">Phase 1 — Foundation</option>
              <option value="2">Phase 2 — Growth</option>
              <option value="3">Phase 3 — Mastery</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Type *</label>
            <select style={inputStyle} value={form.type} onChange={e => set("type", e.target.value)}>
              <option value="article">Article</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Duration *</label>
            <input style={inputStyle} value={form.duration} onChange={e => set("duration", e.target.value)} required placeholder="e.g. 12 min read" />
          </div>
          <div>
            <label style={labelStyle}>Category *</label>
            <input style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)} required placeholder="e.g. Vision, Resilience" />
          </div>
          <div>
            <label style={labelStyle}>Badge Colour *</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.categoryColor} onChange={e => set("categoryColor", e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer flex-shrink-0" style={{ background: "none", border: "1px solid #1e2540", padding: "2px" }} />
              <input style={{ ...inputStyle, flex: 1 }} value={form.categoryColor} onChange={e => set("categoryColor", e.target.value)} placeholder="#c49a3c" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-5">
            <label style={{ ...labelStyle, margin: 0 }}>Published</label>
            <button type="button" onClick={() => set("published", !form.published)}
              className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
              style={{ background: form.published ? "#c49a3c" : "#1e2540" }}>
              <div className="w-4 h-4 rounded-full absolute top-1 transition-all"
                style={{ background: "#fff", left: form.published ? "26px" : "4px" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Video URL */}
      {form.type === "video" && (
        <div style={sectionStyle}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c49a3c" }}>Video</p>
          <label style={labelStyle}>YouTube Embed URL</label>
          <input style={inputStyle} value={form.videoUrl} onChange={e => set("videoUrl", e.target.value)}
            placeholder="https://www.youtube.com/embed/VIDEO_ID" />
          <p className="text-xs mt-2" style={{ color: "#3a4060" }}>
            Get from YouTube: share → embed → copy the src URL only (starts with https://www.youtube.com/embed/)
          </p>
        </div>
      )}

      {/* Skills */}
      <div style={sectionStyle}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c49a3c" }}>Skill XP Awards</p>
        <p className="text-xs mb-4" style={{ color: "#6b7280" }}>Set how many XP points each skill earns when this module is completed. Leave at 0 to award nothing.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SKILLS.map((skill) => (
            <div key={skill}>
              <label style={labelStyle}>{SKILL_LABELS[skill]}</label>
              <input type="number" min="0" max="50" style={inputStyle}
                value={form.skills[skill] ?? 0}
                onChange={e => setSkill(skill, parseInt(e.target.value) || 0)} />
            </div>
          ))}
        </div>
      </div>

      {/* Content sections */}
      <div style={sectionStyle}>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#c49a3c" }}>Content Sections</p>
        <p className="text-xs mb-4" style={{ color: "#6b7280" }}>Each section has a heading and a body paragraph. Add as many as you need.</p>
        <div className="space-y-4">
          {form.content.map((section, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: "#111828", border: "1px solid #1e2540" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold" style={{ color: "#6b7280" }}>Section {i + 1}</span>
                {form.content.length > 1 && (
                  <button type="button" onClick={() => removeSection(i)}
                    className="text-xs px-2 py-1 rounded-lg transition-all"
                    style={{ color: "#ff8080", background: "#ff808011" }}>
                    Remove
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label style={labelStyle}>Heading</label>
                  <input style={inputStyle} value={section.heading} onChange={e => updateSection(i, "heading", e.target.value)} placeholder="Section heading" />
                </div>
                <div>
                  <label style={labelStyle}>Body</label>
                  <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                    value={section.body} onChange={e => updateSection(i, "body", e.target.value)}
                    placeholder="Write the content for this section..." />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addSection}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "#1e2540", color: "#6b7280" }}>
          + Add Section
        </button>
      </div>

      {error && (
        <p className="text-sm py-3 px-4 rounded-xl text-center" style={{ background: "#ff4d4d11", color: "#ff8080", border: "1px solid #ff4d4d22" }}>
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
          style={{ background: saving ? "#8a6d2a" : "#c49a3c", color: "#07090f", cursor: saving ? "wait" : "pointer" }}>
          {saving ? "Saving..." : mode === "create" ? "Create Module" : "Save Changes"}
        </button>
        <a href="/admin/modules"
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{ background: "#1e2540", color: "#6b7280" }}>
          Cancel
        </a>
      </div>
    </form>
  );
}
