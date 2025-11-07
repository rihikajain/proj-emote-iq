// /app/api/quote/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ✅ Correct SDK import
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize client (requires GEMINI_API_KEY in .env)
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_NAME = "gemini-2.0-flash"; // or "gemini-1.5-flash"

export async function GET() {
  // --- Authentication ---
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // session.user may include a custom 'id' at runtime; assert type to access it safely
  const userId = (session.user as unknown as { id?: string }).id;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const last7 = new Date();
  last7.setDate(last7.getDate() - 7);

  // --- Fetch mood data ---
  const entries = await prisma.moodEntry.findMany({
    where: { userId, createdAt: { gte: last7 } },
    select: { mood: true, note: true, moodScore: true, createdAt: true },
  });

  if (entries.length === 0) {
    return NextResponse.json({
      reflection: "No recent mood entries found for the past 7 days.",
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
    "You are a friendly emotional wellness assistant. Provide a short, precise  highly relevant motivational quote.";

  const userPrompt = `Here are my recent mood entries. Analyze this data and follow your instructions. Mood Entries:\n${moodData}`;

  try {
    const model = ai.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 500,
      },
    });

  
    // Existing AI reflection code (cleaned)
    const reflectionTextRaw =
      result.response.text() || "No reflection could be generated.";
    const reflectionText = reflectionTextRaw
      .replace(/[\r\n]+/g, "\n")
      .replace(/\s{2,}/g, " ")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 8)
      .join("\n");
// Include it in the API response
return NextResponse.json({
  reflection: reflectionText,
});

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI reflection. Check API key and quota." },
      { status: 500 }
    );
  }
}
