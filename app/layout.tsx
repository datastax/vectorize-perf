import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vectorize",
  description: "DataStax Vectorize perf demo powered by NVIDIA NeMo embeddings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${sora.className} flex flex-col items-center w-full h-full px-6 overflow-hidden`}>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
