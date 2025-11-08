"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center text-center w-full min-h-screen bg-gradient-to-b from-background to-muted/30 text-foreground overflow-hidden">
      <div className="min-h-screen min-w-screen">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center min-h-screen min-w-screen px-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
          >
            EmoteIQ — <br className="hidden md:block" /> Know Your Mood, Know
            Yourself
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-8"
          >
            Track your emotions, uncover hidden patterns, and grow emotionally
            intelligent — one reflection at a time.
          </motion.p>

          {!session ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 mb-10"
            >
              <Button
                asChild
                className="bg-[var(--color-primary)] text-[var(--color-text)] hover:scale-105 transition-all"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[var(--color-primary)] text-[var(--color-text)] hover:scale-105 transition-all"
              >
                <Link href="/login">Login</Link>
              </Button>
            </motion.div>
          ) : (
            <Button
              asChild
              className="bg-[var(--color-primary)] text-[var(--color-text)] hover:scale-105 transition-all mb-10"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </motion.section>
      </div>

      <section className="py-20 px-6 max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6"
        >
          About EmoteIQ
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground mb-6"
        >
          EmoteIQ isn’t just a journal — it’s your emotional companion. By
          logging moods, you get personalized insights, AI-powered reflections,
          and a deeper understanding of what truly affects your mental state.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="relative w-full max-w-3xl aspect-[16/9] overflow-hidden flex items-center justify-center"
        >
          <Image
            src="/home.png"
            alt="Mood tracking illustration"
            width={400}
            height={300}
            className="object-cover rounded-lg"
          />
        </motion.div>
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "🌙 Track Emotions",
              desc: "Record your daily moods in seconds and visualize your journey.",
            },
            {
              title: "📊 Get Insights",
              desc: "Discover trends and triggers that influence your emotional state.",
            },
            {
              title: "🧠 AI Reflection",
              desc: "Weekly summaries that help you grow emotionally aware.",
            },
          ].map((f, i) => (
            <motion.li
              key={i}
              whileHover={{ scale: 1.05 }}
              className="mt-15 p-6 rounded-xl bg-gradient-to-r from-[var(--color-secondary-4)]/50 to-[var(--color-secondary-1)]/50 shadow hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <section className="py-16 px-6 w-full bg-muted/40 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-4"
        >
          Get in Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 dark:text-gray-300 mb-6"
        >
          Have questions, ideas, or feedback? We’d love to hear from you!
        </motion.p>
        <Button
          asChild
          className="bg-[var(--color-primary)] text-[var(--color-text)] hover:scale-105 transition-all"
        >
          <Link href="mailto:support@emoteiq.app">Contact Us</Link>
        </Button>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} EmoteIQ. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
