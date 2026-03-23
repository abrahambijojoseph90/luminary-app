import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ModuleForm } from "@/components/admin/ModuleForm";

export default async function EditModulePage({ params }: { params: { id: string } }) {
  const mod = await prisma.module.findUnique({ where: { id: parseInt(params.id) } });
  if (!mod) notFound();

  return (
    <main className="px-4 md:px-8 py-8 pb-24 lg:pb-8 max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <a href="/admin/modules" className="text-xs hover:opacity-80" style={{ color: "#6b7280" }}>← Back to Modules</a>
        <h1 className="font-display text-4xl font-bold mt-3 mb-1" style={{ color: "#e8e4d9" }}>Edit Module</h1>
        <p style={{ color: "#6b7280" }}>{mod.title}</p>
      </div>
      <div className="animate-fade-up-2">
        <ModuleForm mode="edit" initial={{
          id: mod.id,
          title: mod.title,
          subtitle: mod.subtitle,
          type: mod.type,
          duration: mod.duration,
          phase: String(mod.phase),
          category: mod.category,
          categoryColor: mod.categoryColor,
          excerpt: mod.excerpt,
          videoUrl: mod.videoUrl ?? "",
          published: mod.published,
          skills: mod.skills as Record<string, number>,
          content: mod.content as { heading: string; body: string }[],
        }} />
      </div>
    </main>
  );
}
