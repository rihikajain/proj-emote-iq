// /app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // ✅ Always check session
    if (!session?.user?.id) {
      return NextResponse.json(
        { averageMood: 0, trend: [], message: "Unauthorized" },
        { status: 200 } // return 200 to avoid frontend JSON error
      );
    }

    const entries = await prisma.moodEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, createdAt: true, moodScore: true },
    });

    if (!entries || entries.length === 0) {
      return NextResponse.json({ averageMood: 0, trend: [] });
    }

    const averageMood =
      entries.reduce((sum, e) => sum + (e.moodScore ?? 0), 0) / entries.length;

    const trend = entries.map((e) => ({
      date: e.createdAt,
      moodScore: e.moodScore ?? 0,
    }));

    return NextResponse.json({ averageMood, trend });
  } catch (err) {
    console.error("Dashboard API Error:", err);
    // Always return valid JSON
    return NextResponse.json({ averageMood: 0, trend: [], message: "Server Error" });
  }
}
