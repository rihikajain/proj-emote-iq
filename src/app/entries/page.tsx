"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddEntryDialog from "@/components/AddEntryDialog";

export default function EntriesClient() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function fetchEntries() {
    try {
      setLoading(true);
      const res = await fetch("/api/entries");
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      console.log(data);
      setEntries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchEntries();
    }
  }, [status]);

  if (status === "loading") return <p className="p-6">Checking session...</p>;
  if (loading) return <p className="p-6">Loading entries...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const formattedName =
    session?.user?.name && session.user.name.length > 0
      ? session.user.name[0].toUpperCase() +
        session.user.name.slice(1).toLowerCase()
      : "User";

  return (
    <div className="min-h-screen w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome {formattedName}!</h1>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-secondary-3)] font-bold"
        >
          + Add Entry
        </Button>
      </div>
      {/* Dialog for adding entry */}
      <AddEntryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdded={fetchEntries}
      />

      <div>
        {entries.length === 0 ? (
          <p>No entries yet!</p>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <p className="font-medium"><span className="font-bold">Mood: </span> {entry.mood}</p>
                {entry.note && (
                  <p className="text-gray-700"> <span className="font-bold" >Note: </span> {entry.note}</p>
                )}
                <p className="text-gray-700"><span className="font-bold" >
                  Tags:{" "}</span> 
                  {entry.emotionTags.map((t:any) => (
                    <span
                      key={t.name}
                      className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs mr-2"
                    >
                      {t.name}
                    </span>
                  ))}
                </p>

                <p className="text-sm text-gray-500">
                  Date: {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
