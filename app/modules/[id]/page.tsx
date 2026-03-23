import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MODULES } from "@/lib/modules-data";
import { Navigation } from "@/components/Navigation";
import { ModuleViewer } from "@/components/ModuleViewer";

export default async function ModulePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const moduleId = parseInt(params.id);
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) notFound();

  const userId = (session.user as { id?: string }).id!;
  const progress = await prisma.userProgress.findUnique({
    where: { userId_moduleId: { userId, moduleId } },
  });

  return (
    <div className="min-h-screen lg:pl-56" style={{ background: "#07090f" }}>
      <Navigation userName={session.user.name} />
      <ModuleViewer module={mod} completed={!!progress} />
    </div>
  );
}
