// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import useTheme from "@/hooks/useTheme";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { theme, toggle } = useTheme();
  // close dropdown on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <header className="w-full left-0 right-0 sticky top-0 z-50">
      <div
        className="flex items-center justify-between px-6 py-4 w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3))",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* left: brand */}
        <div className="flex items-center justify-between  w-full ">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              {/* <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary), var(--color-secondary-1))",
              }}
            >
              <div
                className="w-5 h-5 rounded-full"
                style={{ background: "#f5f5f4" }}
              />
            </div> */}

              <img src="/what.png" alt="icon" className="w-10 h-10" />

              <span className="text-lg font-semibold">EmoteIQ</span>
            </Link>
          </div>

          {/* right: conditional nav */}
          <div className="flex items-center  gap-4">
            {/* show links only when authenticated */}
            {status === "authenticated" && (
              <>
                <Link
                  href="/entries"
                  className="text-sm font-medium hover:underline"
                >
                  Entries
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:underline"
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* if loading, show nothing extra */}
            {status === "loading" && (
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
            )}

            {/* if unauthenticated, only show brand (we already have left) and optionally login link */}
            {status !== "authenticated" && (
              <div className="ml-2" aria-hidden>
                {/* intentionally empty to keep layout minimal for unauthenticated users */}
              </div>
            )}

            {/* when authenticated show username and dropdown */}
            {status === "authenticated" && session?.user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-[rgba(0,0,0,0.04)]"
                  aria-haspopup="true"
                  aria-expanded={open}
                >
                  <span className="text-sm">
                  {session.user.name[0].toUpperCase() + session.user.name.slice(1).toLowerCase()}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#111827] rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* toggle button/ */}

        <button suppressHydrationWarning
          onClick={toggle}
          aria-label="Toggle theme"
          className="p-2 "
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
