"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "same-origin", // add this
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Signup failed");
        return;
      }
      setLoading(false);

      router.push("/login");
    } catch (err) {
      setError("Something went wrong. Try again!");
    }
  };

  return (
    <div className="h-fit flex items-center not-[]:shadow-lg rounded-2xl justify-center bg-[var(--color-bg)]">
      <form
        onSubmit={handleSignup}
        className="bg-[var(--color-bg)] border border-[var(--color-secondary-1)] rounded-2xl p-8 w-full max-w-md text-[var(--color-text)]"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-primary)]">
          Join EmoteIQ
        </h2>

        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-[var(--color-secondary-1)] bg-transparent text-[var(--color-text)]"
          />
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[var(--color-secondary-1)] bg-transparent text-[var(--color-text)]"
          />
          <Input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[var(--color-secondary-1)] bg-transparent text-[var(--color-text)]"
          />

          {error && (
            <p className="text-[var(--color-secondary-3)] text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-secondary-3)] transition"
          >
            {loading ? "Signing in..." : "Sign Up"}
          </Button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--color-secondary-1)] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
