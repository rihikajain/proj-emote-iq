"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function EntriesClient() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      async function fetchEntries() {
        try {
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
      fetchEntries();
    }
  }, [status]);

  if (status === "loading") return <p className="p-6">Checking session...</p>;
  if (loading) return <p className="p-6">Loading entries...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  const formattedName =
    session.user.name && session.user.name.length > 0
      ? session.user.name[0].toUpperCase() +
        session.user.name.slice(1).toLowerCase()
      : "User";
  return (
    
      <div className="min-h-screen w-full">
        <h1 className="text-2xl font-bold px-6 pt-6">
          Welcome {formattedName} !
        </h1>
    
      <div className=" p-6">
        {entries.length === 0 ? (
          <p>No entries yet!</p>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <p className="font-medium">Mood: {entry.mood}</p>
                {entry.note && (
                  <p className="text-gray-700">Note: {entry.note}</p>
                )}
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
