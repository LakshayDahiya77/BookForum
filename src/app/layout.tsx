import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ConditionalHeader from "@/components/ConditionalHeader";
import TopProgressBar from "@/components/ProgressBar";
import { Montserrat, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const fontHeading = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
});

const fontBody = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Literary Insights",
  description: "Share. Discuss. Explore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", fontHeading.variable, fontBody.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <TopProgressBar />
        <ConditionalHeader>
          <Header />
        </ConditionalHeader>
        {children}
      </body>
    </html>
  );
}
