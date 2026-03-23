import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const check = await requireAdmin();
  if (check.error) return check.error;

  const mod = await prisma.module.findUnique({ where: { id: parseInt(params.id) } });
  if (!mod) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mod);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const check = await requireAdmin();
  if (check.error) return check.error;

  const body = await req.json();
  const { title, subtitle, type, duration, phase, category, categoryColor, excerpt, videoUrl, skills, content, published } = body;

  const mod = await prisma.module.update({
    where: { id: parseInt(params.id) },
    data: {
      title: title?.trim(),
      subtitle: subtitle?.trim(),
      type,
      duration: duration?.trim(),
      phase: phase !== undefined ? parseInt(phase) : undefined,
      category: category?.trim(),
      categoryColor,
      excerpt: excerpt?.trim(),
      videoUrl: videoUrl?.trim() || null,
      skills,
      content,
      published,
    },
  });

  return NextResponse.json(mod);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const check = await requireAdmin();
  if (check.error) return check.error;

  await prisma.userProgress.deleteMany({ where: { moduleId: parseInt(params.id) } });
  await prisma.module.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true });
}
