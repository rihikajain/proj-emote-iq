import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    const entries = await prisma.moodEntry.findMany({
      where: userId ? { userId } : {},
      include: { emotionTags: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(entries, { status: 200 });
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
    const body = await req.json();
    const { userId, mood, note, tags } = body;

    if (!userId || !mood) {
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
        user: { connect: { id: userId } },
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
