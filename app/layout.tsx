import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "스마트 온실 모델링 이론과 개발 · 프로젝트 갤러리",
    template: "%s · 스마트 온실 모델링",
  },
  description:
    "스마트 온실 모델링 이론과 개발 강의 수강생들이 학기 동안 만든 프로젝트를 모아둔 갤러리입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-900 dark:text-stone-100">
        <Header />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
          {children}
        </main>
        <footer className="border-t border-stone-200 dark:border-stone-800 py-6 text-center text-xs text-stone-500 dark:text-stone-400">
          © {new Date().getFullYear()} 스마트 온실 모델링 이론과 개발
        </footer>
      </body>
    </html>
  );
}
