import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_NAME = "gemini-2.0-flash";
// const MODEL_NAME = "gemini-1.5-flash";
// const MODEL_NAME = "gemini-pro";

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
        `${e.createdAt.toDateString()}: score ${e.moodScore} (${
          e.mood
        }) note: ${e.note}`
    )
    .join("\n");

  const systemInstruction =
    "You are a friendly emotional wellness assistant. Provide a reflection of the user's emotional trend over the last 7 days. Format your response in exactly and strictly in two paragraphs: first paragraph should be a concise summary, second paragraph should be a motivational quote or message based on the reflection.";

  const userPrompt = `Here are my recent mood entries:\n${moodData}`;
  function generateFallbackReflection(entries: any[]) {
    const avg =
      entries.reduce((sum, e) => sum + (e.moodScore ?? 0), 0) / entries.length;

    if (avg <= 3) {
      return {
        summary:
          "Your recent mood entries suggest a challenging emotional week. There are signs of fatigue or stress, but the consistency in tracking shows strength.",
        motivational:
          "Be gentle with yourself. Healing and progress are not linear.",
      };
    }

    if (avg <= 6) {
      return {
        summary:
          "Your mood over the past week appears mixed, with both steady and difficult moments. This reflects resilience amid everyday challenges.",
        motivational:
          "Progress doesn’t require perfection — consistency matters more.",
      };
    }

    return {
      summary:
        "Your recent mood entries show a generally positive and balanced emotional state. You seem to be managing your wellbeing well.",
      motivational:
        "Celebrate this momentum and continue nurturing habits that support you.",
    };
  }

  try {
    const model = ai.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction,
    });

   const result = await model.generateContent({
  contents: [
    {
      role: "user",
      parts: [{ text: userPrompt }],
    },
  ],
  generationConfig: { temperature: 0.5, maxOutputTokens: 300 },
});


    const rawText =
      result.response.text() || "No reflection could be generated.";

    const paragraphs = rawText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const summary = paragraphs[0] || "";
    const motivational = paragraphs[1] || "";

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

    const fallback = generateFallbackReflection(entries);

    const moodDataStructured = entries.map((e) => ({
      date: e.createdAt.toISOString().split("T")[0],
      mood: e.mood,
      moodScore: e.moodScore,
      note: e.note,
    }));

    return NextResponse.json({
      summary: fallback.summary,
      motivational: fallback.motivational,
      moodData: moodDataStructured,
      activitySuggestions: ["Take a short walk", "Write one positive thought"],
      aiUsed: false,
    });
  }
}
