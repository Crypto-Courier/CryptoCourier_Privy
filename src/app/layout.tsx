import "./globals.css";
import Providers from "../components/Providers";
import CatEmojiAnimation from "@/components/CatEmojiAnimation";

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
