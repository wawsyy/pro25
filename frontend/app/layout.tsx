import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Nightly Reflection - Encrypted Reflection Journal",
  description: "Store your nightly reflections securely with FHE encryption",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`reflection-bg text-foreground antialiased`}>
        <Providers>
          <Header />
          <main className="max-w-4xl mx-auto pb-8 px-4 sm:px-6 pt-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}


