"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div>
      <div className="h-fit flex items-center shadow-lg rounded-2xl justify-center bg-[var(--color-bg)]">
        <form
          onSubmit={handleLogin}
          className="bg-[var(--color-bg)] border border-[var(--color-secondary-1)] rounded-2xl p-8 w-full max-w-md text-[var(--color-text)]"
        >
          <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-primary)]">
            Welcome Back to EmoteIQ
          </h2>
          <div className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border-[var(--color-secondary-1)] bg-transparent text-[var(--color-text)]"
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
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
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-[var(--color-secondary-1)] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
