import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as unknown as { id?: string }).id;

  const entries = await prisma.moodEntry.findMany({
    where: { userId },
    select: { note: true, mood: true, createdAt: true },
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  const data = entries.map(e => `${e.createdAt.toDateString()}: (${e.mood}) ${e.note}`).join("\n");
  const prompt = `
You are a sentiment pattern analyzer.
Find the most common emotional TRIGGERS or themes from these entries.
Return a summary like:
- Top triggers
- Emotions linked with each
- Short advice for managing each trigger.
Data:\n${data}
`;

  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return NextResponse.json({ triggers: result.response.text() });
}
