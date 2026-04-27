import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ConditionalHeader from "@/components/ConditionalHeader";
import { Playfair_Display, DM_Sans, Montserrat } from "next/font/google";

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
      className={`${fontHeading.variable} ${fontBody.variable} h-full antialiased`}
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
