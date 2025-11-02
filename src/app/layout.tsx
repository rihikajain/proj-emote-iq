import "./globals.css";

export const metadata = {
  title: "EmoteIQ",
  description: "AI-powered mood journal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
