
import "./globals.css";
import "./theme.css";
import  Navbar  from "@/components/Navbar";
import  AnimatedBackground  from "@/components/AnimatedBackground";
import Providers from "./providers";

export const metadata = {
  title: "EmoteIQ",
  description: "Know your mood, know yourself",
  icons: {
    icon: "/what.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300" suppressHydrationWarning>
        <AnimatedBackground />
        <Providers>
          <Navbar />
          <main className="relative w-full min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

