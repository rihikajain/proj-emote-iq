// src/app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import useTheme from "@/hooks/useTheme";

export default function Providers({ children, session }: { children: React.ReactNode; session?: any }) {
  useTheme();
  return <SessionProvider refetchInterval={0} session={session}>{children}</SessionProvider>;
}
