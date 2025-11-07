"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface AddEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddEntryDialog({
  open,
  onClose,
  onAdded,
}: AddEntryDialogProps) {
  const { data: session } = useSession();
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [moodScore, setMoodScore] = useState<number | null>(null);

  const handleSubmit = async () => {
    setLoading(true);

    if (!session?.user?.id) {
      setLoading(false); 
      return alert("No user session found");
    }

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          mood,
          note,
          tags: tags.split(",").map((t) => t.trim()),
          moodScore,
        }),
      });

      if (res.ok) {
        onAdded();
        onClose();
        setMood("");
        setNote("");
        setTags("");
        setMoodScore(null);
      } else {
        const errorData = await res.json();
        alert(`Submission failed: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // emoji list with numeric scores
  const emojiOptions = [
    { emoji: "😞", label: "Very Low", value: 1 },
    { emoji: "😟", label: "Low", value: 2 },
    { emoji: "😐", label: "Neutral", value: 3 },
    { emoji: "😄", label: "Happy", value: 4 },
    { emoji: "😍", label: "Excellent", value: 5 },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--color-bg)] border-[var(--color-secondary-1)] text-[var(--color-text)] rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[var(--color-secondary-1)] text-xl font-bold">
            Add New Entry
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mood Emoji Picker */}
          <div>
            <p className="font-semibold mb-2">How are you feeling today?</p>
            <div className="flex justify-between items-center">
              {emojiOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMoodScore(option.value)}
                  className={`text-3xl transition-transform duration-200 ${
                    moodScore === option.value
                      ? "scale-125 ring-2 ring-[var(--color-secondary-2)] rounded-full"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  title={option.label}
                >
                  {option.emoji}
                </button>
              ))}
            </div>
          </div>

          <Input
            placeholder="Mood title (e.g. 'Calm but tired')"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="border-[var(--color-secondary-1)] text-[var(--color-text)] focus:ring focus:ring-offset-2 focus:ring-[var(--color-secondary-1)]"
          />

          <Textarea
            placeholder="Describe your day..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border-[var(--color-secondary-1)] text-[var(--color-text)] focus:ring focus:ring-offset-2 focus:ring-[var(--color-secondary-1)]"
          />

          <Input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border-[var(--color-secondary-1)] text-[var(--color-text)] focus:ring focus:ring-offset-2 focus:ring-[var(--color-secondary-1)]"
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[var(--color-secondary-1)] text-[var(--color-bg)] hover:bg-[var(--color-secondary-2)] hover:text-[var(--color-secondary-1)] font-bold transition"
          >
            {loading ? "Loading..." : "Save Entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
