"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function MoodForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ mood, note, tags: tags.split(",").map((t) => t.trim()) });
    setMood("");
    setNote("");
    setTags("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-secondary-1)] shadow-lg"
    >
      <h2 className="text-[var(--color-primary)] text-xl font-semibold">Log Your Mood</h2>

      <Input
        placeholder="Your mood (happy, anxious...)"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="border-[var(--color-secondary-2)] text-[var(--color-text)]"
      />
      <Textarea
        placeholder="Describe your day..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border-[var(--color-secondary-3)] text-[var(--color-text)]"
      />
      <Input
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="border-[var(--color-secondary-1)] text-[var(--color-text)]"
      />
      <Button
        type="submit"
        className="w-full bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-secondary-3)]"
      >
        Save Mood
      </Button>
    </form>
  );
}
