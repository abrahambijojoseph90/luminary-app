import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const check = await requireAdmin();
  if (check.error) return check.error;

  const modules = await prisma.module.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(modules);
}

export async function POST(req: NextRequest) {
  const check = await requireAdmin();
  if (check.error) return check.error;

  const body = await req.json();
  const { title, subtitle, type, duration, phase, category, categoryColor, excerpt, videoUrl, skills, content, published } = body;

  if (!title || !subtitle || !type || !duration || !phase || !category || !categoryColor || !excerpt) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const maxOrder = await prisma.module.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? 0) + 1;

  const mod = await prisma.module.create({
    data: {
      title: title.trim(),
      subtitle: subtitle.trim(),
      type,
      duration: duration.trim(),
      phase: parseInt(phase),
      category: category.trim(),
      categoryColor,
      excerpt: excerpt.trim(),
      videoUrl: videoUrl?.trim() || null,
      skills: skills ?? {},
      content: content ?? [],
      published: published ?? true,
      order,
    },
  });

  return NextResponse.json(mod, { status: 201 });
}
