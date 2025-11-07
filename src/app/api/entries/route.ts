// /app/api/entries/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const moodCategories = [
  {
    emoji: "😞",
    score: 1,
    keywords: [
      "sad",
      "angry",
      "tired",
      "lonely",
      "upset",
      "depressed",
      "anxious",
    ],
  },
  { emoji: "😟", score: 2, keywords: ["low", "weird", "frustated"] },
  {
    emoji: "😐",
    score: 3,
    keywords: ["neutral", "okay", "fine", "bored", "unknown"],
  },
  {
    emoji: "😄",
    score: 4,
    keywords: ["good", "excited", "hopeful", "positive", "productive",],
  },
  {
    emoji: "😍",
    score: 5,
    keywords: ["love", "amazing", "great", "joy", "awesome", "wonderful","happy", "grateful", "calm", "relaxed", "satisfied"],
  },
];

// 🔹 GET all user entries
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

// 🔹 POST new mood entry
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { mood, note, tags = [], moodScore } = await req.json();
    const userId = session.user.id;

    function determineMoodScore(text: string) {
      const lower = text.toLowerCase();
      for (const c of moodCategories) {
        if (c.keywords.some((kw) => lower.includes(kw))) return c.score;
      }
      return 3; // default neutral
    }

    const derivedScore =
      moodScore ?? determineMoodScore([mood, note, tags.join(" ")].join(" "));

    const tagRecords = await Promise.all(
      tags.map(async (name: string) =>
        prisma.emotionTag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );

    const entry = await prisma.moodEntry.create({
      data: {
        userId,
        mood,
        note,
        moodScore: derivedScore,
        emotionTags: {
          connect: tagRecords.map((t) => ({ id: t.id })),
        },
      } as any,
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("POST /api/entries error:", error);
    return NextResponse.json({ error: "Failed to add entry" }, { status: 500 });
  }
}
