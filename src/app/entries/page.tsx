"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddEntryDialog from "@/components/AddEntryDialog";
import { motion } from "framer-motion";

const toProperCase = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Get start of week (Sunday) for a given date
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// Format a date as "Sun 3 Nov"
const formatDayLabel = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export default function EntriesClient() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  async function fetchEntries() {
    try {
      setLoading(true);
      const res = await fetch("/api/entries");
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      setEntries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") fetchEntries();
  }, [status]);

  if (status === "loading") return <p className="p-6">Checking session...</p>;
  if (loading) return <p className="p-6">Loading entries...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const formattedName =
    session?.user?.name && session.user.name.length > 0
      ? toProperCase(session.user.name)
      : "User";

  // Group entries by week start date, then by day
  const weeklyEntries: Record<string, Record<string, any[]>> = {};
  entries.forEach((entry) => {
    const dateObj = new Date(entry.createdAt);
    const weekStart = getStartOfWeek(dateObj).toDateString();
    const dayKey = dateObj.toDateString();

    if (!weeklyEntries[weekStart]) weeklyEntries[weekStart] = {};
    if (!weeklyEntries[weekStart][dayKey])
      weeklyEntries[weekStart][dayKey] = [];
    weeklyEntries[weekStart][dayKey].push(entry);
  });

  return (
    <div className="min-h-screen w-full p-6 text-[var(--color-text)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-rgb: 26,26,26;)]">
          Welcome {formattedName}!
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
        >
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-[var(--color-primary)] hover:bg-(--color-secondary-3) text-[var(--color-text)] font-bold shadow-lg"
          >
            + Add Entry
          </Button>
        </motion.div>
      </div>

      {/* Add Entry Dialog */}
      <AddEntryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdded={fetchEntries}
      />

      {/* Weekly Entries */}
      {entries.length === 0 ? (
        <p className="text-center text-[var(--muted)] mt-20 text-lg">
          No entries yet!
        </p>
      ) : (
        Object.keys(weeklyEntries).map((weekStart) => {
          const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            return d;
          });

          return (
            <div key={weekStart} className="mb-12">
              <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4 border-b border-border pb-2">
                Week of{" "}
                {new Date(weekStart).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>

              <div className="grid grid-cols-7 gap-4">
                {daysOfWeek.map((day) => {
                  const dayKey = day.toDateString();
                  const dayEntries = weeklyEntries[weekStart][dayKey] || [];

                  return (
                    <div key={dayKey} className="flex flex-col gap-2">
                      <h3 className="text-sm font-medium text-[var(--color-text)] mb-1 text-center">
                        {formatDayLabel(day)}
                      </h3>

                      {dayEntries.length === 0 ? (
                        <div className="rounded-xl p-2 bg-[var(--card-bg)] text-center text-[var(--muted)]">
                          -
                        </div>
                      ) : (
                        dayEntries.map((entry) => (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.03 }}
                            className="rounded-xl p-3 bg-[var(--card-bg)] shadow hover:shadow-lg border-l-4 border-[var(--color-primary)] overflow-hidden text-[var(--color-text)] "
                          >
                            <p className="font-medium text-[var(--color-secondary-3)]">
                              <span className="font-bold">Mood: </span>
                              {toProperCase(entry.mood)}
                            </p>
                            {entry.note && (
                              <p className="text-[var(--muted)] mt-1">
                                <span className="font-bold">Note: </span>
                                {toProperCase(entry.note)}
                              </p>
                            )}
                            <p className="text-[var(--muted)] mt-2 text-xs flex flex-wrap gap-1">
                              {entry.emotionTags.map((t: any) => (
                                <span
                                  key={t.name + entry.id}
                                  className="inline-block bg-[var(--color-primary)]/30 text-[var(--color-text)] rounded-full px-2 py-0.5"
                                >
                                  {toProperCase(t.name)}
                                </span>
                              ))}
                            </p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
