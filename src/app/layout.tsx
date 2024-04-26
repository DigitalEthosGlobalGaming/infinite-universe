import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 👇 import the providers
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Capycute",
  description: "Your favorite capybara and quokka image generator!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}