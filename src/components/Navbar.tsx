"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

interface Entry {
  id: string;
  mood: string;
  note: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  // Populate user info from session
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  // Fetch user's entries safely
  useEffect(() => {
    if (session) {
      fetch("/api/entries")
        .then((res) => res.json())
        .then((data) =>
          setEntries(Array.isArray(data.entries) ? data.entries : [])
        )
        .catch((err) => {
          console.error("Failed to fetch entries:", err);
          setEntries([]);
        });
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading your profile...</p>;
  }

  if (!session) {
    return <p>You need to log in to view your profile.</p>;
  }

  const handleSave = () => {
    // TODO: Connect to API to update user info
    console.log("Saved info:", { name, email });
    alert("Profile info saved!");
  };

  const averageMood =
    entries.length > 0
      ? (
          entries.reduce((sum, e) => sum + parseInt(e.mood || "0"), 0) /
          entries.length
        ).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <ThemeToggle />
      </div>

      {/* User Info */}
      <div className="bg-card p-6 rounded-xl shadow-md max-w-md mb-6">
        <div className="flex items-center gap-4 mb-4">
          
            <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-white text-lg">
              {session.user?.name?.[0] || "U"}
            </div>
        
          <div>
            <p className="font-semibold text-lg">{session.user?.name || "Anonymous"}</p>
            <p className="text-sm text-muted-foreground">{session.user?.email || "No email"}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Edit Info */}
      <div className="bg-card p-6 rounded-xl shadow-md max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Edit Info</h2>

        <label className="block mb-2">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </label>

        <label className="block mb-4">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </label>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition"
        >
          Save
        </button>
      </div>

      {/* Mood Stats */}
      <div className="bg-card p-6 rounded-xl shadow-md max-w-2xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Mood Stats</h2>
        <p>Total Entries: {entries.length}</p>
        <p>Average Mood: {averageMood}/10</p>
      </div>

      {/* Recent Entries */}
      <div className="bg-card p-6 rounded-xl shadow-md max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Recent Entries</h2>
        {entries.length === 0 ? (
          <p>No entries yet.</p>
        ) : (
          <ul className="space-y-3">
            {entries.slice(-5).reverse().map((entry) => (
              <li key={entry.id} className="p-4 bg-muted rounded-md">
                <p>
                  <strong>Mood:</strong> {entry.mood}/10
                </p>
                <p>
                  <strong>Note:</strong> {entry.note || "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
