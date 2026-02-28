import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xiang Feng - Projects",
  description: "我的项目与创意",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
