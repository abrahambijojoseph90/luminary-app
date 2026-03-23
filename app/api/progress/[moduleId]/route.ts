import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const moduleId = parseInt(params.moduleId);
  if (!userId || isNaN(moduleId)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.userProgress.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    create: { userId, moduleId },
    update: { completedAt: new Date(), lastViewedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const moduleId = parseInt(params.moduleId);
  if (!userId || isNaN(moduleId)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.userProgress.deleteMany({ where: { userId, moduleId } });
  return NextResponse.json({ success: true });
}
