import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "INNTW — If Not Now Then When",
  description: "Something is coming.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "INNTW",
    description: "If Not Now Then When",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "INNTW",
    description: "If Not Now Then When",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/*
          Pre-fetch the background music as soon as the page loads so the
          bytes are in the HTTP cache by the time the user taps "enter".
          We do NOT decode here — Web Audio still decodes lazily on tap to
          keep memory pressure off Instagram's Android WebView.
        */}
        <link
          rel="preload"
          as="fetch"
          type="audio/mpeg"
          href="/angie-loop.mp3"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}