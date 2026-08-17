import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samanta TikTok Shop",
  description:
    "Aprenda com Samanta Vidal a transformar conteúdo em uma operação de vendas no TikTok Shop.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
