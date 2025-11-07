// /app/api/reflection/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ✅ Correct SDK import
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize client (requires GEMINI_API_KEY in .env)
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_NAME = "gemini-2.0-flash"; // or "gemini-1.5-flash"
// ... keep all imports and initialization as in your older version

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as unknown as { id?: string }).id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const last7 = new Date();
  last7.setDate(last7.getDate() - 7);

  const entries = await prisma.moodEntry.findMany({
    where: { userId, createdAt: { gte: last7 } },
    select: { mood: true, note: true, moodScore: true, createdAt: true },
  });

  if (entries.length === 0) {
    return NextResponse.json({
      summary: "No recent mood entries found for the past 7 days.",
      motivational: "",
      moodData: [],
      activitySuggestions: [],
    });
  }

  const moodData = entries
    .map(
      (e) =>
        `${e.createdAt.toDateString()}: score ${e.moodScore} (${e.mood}) note: ${e.note}`
    )
    .join("\n");

  const systemInstruction =
    "You are a friendly emotional wellness assistant. Provide a reflection of the user's emotional trend over the last 7 days. Format your response in exactly and strictly in two paragraphs: first paragraph should be a concise summary, second paragraph should be a motivational quote or message based on the reflection.";

  const userPrompt = `Here are my recent mood entries:\n${moodData}`;

  try {
    const model = ai.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: { temperature: 0.5, maxOutputTokens: 500 },
    });

    const rawText = result.response.text() || "No reflection could be generated.";

    // --- Split into paragraphs ---
    const paragraphs = rawText
      .split(/\n\s*\n/) // split on double line breaks
      .map((p) => p.trim())
      .filter(Boolean);

    const summary = paragraphs[0] || "";
    const motivational = paragraphs[1] || "";

    // Structured mood data
    const moodDataStructured = entries.map((e) => ({
      date: e.createdAt.toISOString().split("T")[0],
      mood: e.mood,
      moodScore: e.moodScore,
      note: e.note,
    }));

    const lastMood = entries[entries.length - 1].moodScore || 2;
    const activitySuggestions: string[] = [];
    if (lastMood <= 3) {
      activitySuggestions.push("Try a 5-min guided meditation");
      activitySuggestions.push("Listen to calming music");
    } else if (lastMood <= 6) {
      activitySuggestions.push("Go for a short walk");
      activitySuggestions.push("Write down 3 things you're grateful for");
    } else {
      activitySuggestions.push("Share your positivity with a friend");
      activitySuggestions.push("Do a creative activity you enjoy");
    }

    return NextResponse.json({
      summary,
      motivational,
      moodData: moodDataStructured,
      activitySuggestions,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI reflection. Check API key and quota." },
      { status: 500 }
    );
  }
}

