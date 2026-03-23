import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const check = await requireAdmin();
  if (check.error) return check.error;

  const { role } = await req.json();
  if (role !== "USER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user);
}
