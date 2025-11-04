"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-72px)] w-full px-6">
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        EmoteIQ — know your mood, know yourself
      </h1>
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-8">
        A simple, beautiful mood-journal that helps you track emotions, discover
        trends, and reflect.
      </p>
      <div className="flex gap-4 mb-10">
        <Button
          asChild
          className="bg-[var(--color-primary)] text-[var(--color-text)] hover:opacity-90 transition-all"
        >
          <Link href="/signup">Get started</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-[var(--color-primary)] text-[var(--color-text)]"
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>
      <div className="bg-white/70 dark:bg-gray-800/70 shadow-xl rounded-xl p-6 max-w-lg">
        <h2 className="text-xl font-semibold mb-2">Why EmoteIQ?</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track moods quickly, tag emotions and receive weekly reflections. Your
          data is private and stored securely.
        </p>
      </div>
    </section>
  );
}
