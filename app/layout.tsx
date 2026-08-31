import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sunlix | TikTok Shop",
  description:
    "Sunlix: método e comunidade para mulheres que querem construir resultados com TikTok Shop.",
  icons: {
    icon: "/brand/sunlix-logo-night.svg?favicon=20260831",
    shortcut: "/brand/sunlix-logo-night.svg?favicon=20260831",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
