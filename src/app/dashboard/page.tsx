"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import AddEntryDialog from "@/components/AddEntryDialog";
import Confetti from "react-confetti";

type MoodEntry = {
  date: string;
  moodScore: number;
  mood: string;
  note: string;
};

type WeeklyReflection = {
  summary: string;
  motivational: string;
  moodData: MoodEntry[];
  activitySuggestions: string[];
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [reflection, setReflection] = useState<WeeklyReflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  async function fetchReflection() {
    try {
      const res = await fetch("/api/ai-reflection");
      const data = await res.json();
      setReflection(data);

      const lastMood = data.moodData[data.moodData.length - 1]?.moodScore || 0;

      if (lastMood >= 4) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch {
      setReflection(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") fetchReflection();
  }, [status]);

  if (loading)
    return <div className="p-8 text-center">Loading your dashboard...</div>;
  if (!reflection)
    return <div className="p-8 text-center">No reflection available</div>;

  const moodData = reflection.moodData || [];
  const trendData = moodData.map((e) => ({
    date: new Date(e.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    moodScore: e.moodScore,
  }));

  const counts = { low: 0, neutral: 0, good: 0 };
  moodData.forEach((e) => {
    if (e.moodScore <= 2) counts.low++;
    else if (e.moodScore === 3) counts.neutral++;
    else counts.good++;
  });

  const pieData = [
    { name: "Low", value: counts.low, color: "#FF8383" },
    { name: "Neutral", value: counts.neutral, color: "#FFF574" },
    { name: "Good", value: counts.good, color: "#99D864" },
  ];

  const moodEmoji = (score: number) => {
    if (score >= 5) return "😍";
    if (score >= 4) return "😄";
    if (score >= 3) return "😊";
    if (score >= 2) return "😐";
    return "😞";
  };

  const avgMood =
    moodData.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) /
      (moodData.length || 1) || 0;
  const todayMood = moodData[moodData.length - 1]?.moodScore || 2;

  return (
    <div className="min-h-screen min-w-screen p-8 max-w-7xl mx-auto space-y-8">
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-[var(--color-secondary-1)] to-[var(--color-secondary-4)] text-white rounded-2xl shadow-md p-6 "
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Explorer"} 👋
          </h1>
          <p className="text-sm mt-1 opacity-90">
            Here’s your emotional reflection for this week 🌙
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-lg font-medium">Today’s Mood</p>
            <span className="text-5xl">{moodEmoji(todayMood)}</span>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Avg Mood</p>
            <span className="text-5xl">{moodEmoji(avgMood)}</span>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-white text-[#4F46E5] font-semibold hover:bg-gray-200 transition rounded-full px-6"
          >
            + Log New Mood
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-secondary-1)]  text-white p-6 rounded-2xl shadow-md text-center text-lg italic"
      >
        {reflection.motivational}
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="p-6 rounded-2xl shadow-md bg-[var(--card-bg)] hover:scale-105 transition-transform"
          >
            <h2 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">
              Summary
            </h2>
            <p>{reflection.summary}</p>
          </motion.div>
<motion.div
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 15,
    delay: 0.1,
  }}
  className="p-6 rounded-2xl shadow-md bg-[var(--card-bg)] hover:scale-105 transition-transform"
>

  <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)] text-center">
    Mood Distribution
  </h2>
  <div className="flex justify-around mb-4 text-center">
    <div>
      <p className="font-bold text-lg text-[#FF8383]">{counts.low}</p>
      <p className="text-sm">Low</p>
    </div>
    <div>
      <p className="font-bold text-lg text-[#FFF574]">{counts.neutral}</p>
      <p className="text-sm">Neutral</p>
    </div>
    <div>
      <p className="font-bold text-lg text-[#99D864]">{counts.good}</p>
      <p className="text-sm">Good</p>
    </div>
  </div>
  <ResponsiveContainer width="100%" height={280}> {/* increased height */}
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        innerRadius={60}
        outerRadius={120} // bigger outer radius
        onMouseEnter={(_, index) => setActiveIndex(index)}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {pieData.map((entry, index) => (
          <Cell key={index} fill={entry.color} cursor="pointer" />
        ))}
      </Pie>
      <Tooltip formatter={(value: any, name: any) => `${name}: ${value}`} />
    </PieChart>
  </ResponsiveContainer>
</motion.div>

        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
 
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="p-6 rounded-2xl shadow-md bg-[var(--card-bg)] hover:scale-105 transition-transform"
          >
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
              Mood Trend (Last 7 Days)
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.1)"
                  />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip formatter={(v: any) => `${moodEmoji(v)} (${v})`} />
                  <Line
                    type="monotone"
                    dataKey="moodScore"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="p-6 rounded-2xl shadow-md bg-[var(--card-bg)] hover:scale-105 transition-transform"
          >
            <h2 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">
              Activity Suggestions
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {reflection.activitySuggestions.map((activity, idx) => (
                <li key={idx}>{activity}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="flex gap-4 justify-center mt-15"
          >
            {moodData.slice(-7).map((e, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }} 
                transition={{
                  delay: i * 0.15,
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                }}
                whileHover={{ scale: 1.8 }}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--color-secondary-1)] text-3xl cursor-pointer shadow-lg"
              >
                {moodEmoji(e.moodScore)}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AddEntryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdded={() => {
          setDialogOpen(false);
          fetchReflection();
        }}
      />
    </div>
  );
}
