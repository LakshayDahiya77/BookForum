import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Montserrat, Google_Sans } from "next/font/google";

const fontHeading = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
});

const fontBody = Google_Sans({
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
