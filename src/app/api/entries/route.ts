import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const entries = await prisma.moodEntry.findMany({
      where: { userId: session.user.id },
      include: { emotionTags: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("GET /api/entries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { mood, note, tags } = body;
    if (!mood) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const tagConnectOrCreate = (tags || []).map((t: string) => ({
      where: { name: t },
      create: { name: t },
    }));
    const newEntry = await prisma.moodEntry.create({
      data: {
        mood,
        note,
        user: { connect: { id: session.user.id } },
        emotionTags: { connectOrCreate: tagConnectOrCreate },
      },
      include: { emotionTags: true },
    });
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("POST /api/entries error:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}
