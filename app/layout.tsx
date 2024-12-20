import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"
import Template from "./template";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ThemeScript } from './components/ThemeScript'
import Script from 'next/script'
import themeScript from "./lib/theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marcus Ellison - Portfolio",
  description: "Marcus Ellison's portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme');
                if (!theme) {
                  theme = 'light';
                  localStorage.setItem('theme', theme);
                }
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `
          }}
        />
        <script
          data-cfasync="false"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Navbar />
          <Template>{children}</Template>
        </ThemeProvider>
      </body>
    </html>
  );
}
