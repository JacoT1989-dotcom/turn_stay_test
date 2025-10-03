// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Frontend Engineering Interview - Jaco Thiart",
  description:
    "Transaction Management System built with Next.js, TypeScript, and TailwindCSS",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              {/* Header with theme toggle */}
              <header className="border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                  <h1 className="text-xl font-semibold">Transaction System</h1>
                  <ThemeToggle />
                </div>
              </header>

              {/* Main content */}
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
