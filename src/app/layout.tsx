import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "../components/Providers";
import { ThemeProvider } from "next-themes";
import ImageClickEffect from "../app/Effect.js";
import CatEmojiAnimation from "@/components/CatEmojiAnimation";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Gryfto",
  description: "Gift token as easy as sending email",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased main`}
      > */}
      <body>
        <Providers>
          <CatEmojiAnimation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
