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
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async () => {
    if (!session?.user?.id) return alert("No user session found");
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        mood,
        note,
        tags: tags.split(",").map((t) => t.trim()),
      }),
    });

    if (res.ok) {
      onAdded();
      onClose();
      setMood("");
      setNote("");
      setTags("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--color-bg)] border-[var(--color-secondary-1)] text-[var(--color-text)]">
        <DialogHeader>
          <DialogTitle className="text-(--color-secondary-1)">
            Add New Entry
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Your mood (happy, anxious...)"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
             className="border-(--color-secondary-1) text-[var(--color-text)] focus:ring focus:ring-offset-2 focus:ring-(--color-secondary-1) focus:outline-none"
          />
          <Textarea
            placeholder="Describe your day..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border-(--color-secondary-1) text-(--color-text) focus:ring focus:ring-offset-2 focus:ring-(--color-secondary-1) focus:outline-none"
          />
          <Input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border-(--color-secondary-1) text-[var(--color-text)] focus:ring focus:ring-offset-2 focus:ring-(--color-secondary-1) focus:outline-none"
          />
          <Button
            onClick={handleSubmit}
            className="w-full bg-(--color-secondary-1) text-[var(--color-bg)] hover:bg-(--color-secondary-4) font-bold"
          >
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
