import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/Navigation";
import { ModuleViewer } from "@/components/ModuleViewer";
import type { DbModule } from "@/lib/modules-data";

export default async function ModulePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const moduleId = parseInt(params.id);
  const mod = await prisma.module.findUnique({ where: { id: moduleId, published: true } });
  if (!mod) notFound();

  const userId = (session.user as { id?: string }).id!;
  const progress = await prisma.userProgress.findUnique({
    where: { userId_moduleId: { userId, moduleId } },
  });

  const dbMod: DbModule = {
    ...mod,
    skills: mod.skills as Record<string, number>,
    content: mod.content as { heading: string; body: string }[],
  };

  return (
    <div className="min-h-screen lg:pl-56" style={{ background: "#07090f" }}>
      <Navigation userName={session.user.name} />
      <ModuleViewer module={dbMod} completed={!!progress} />
    </div>
  );
}
