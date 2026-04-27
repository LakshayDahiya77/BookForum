import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ConditionalHeader from "@/components/ConditionalHeader";
import { Playfair_Display, DM_Sans, Montserrat, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fontHeading = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
});

const fontBody = DM_Sans({
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
      className={cn("h-full", "antialiased", fontHeading.variable, fontBody.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ConditionalHeader>
          <Header />
        </ConditionalHeader>
        {children}
      </body>
    </html>
  );
}
