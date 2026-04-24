import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Playfair_Display, DM_Sans } from "next/font/google";

const fontHeading = Playfair_Display({
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
      className={`${fontHeading.variable} ${fontBody.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
