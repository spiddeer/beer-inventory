'use client'

import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <head>
        <title>Beer Inventory - Track Your Collection</title>
        <meta name="description" content="Manage and track your beer collection with ease" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300`}
      >
        <AuthProvider>
          {/* Dark mode toggle button */}
          <button
            onClick={toggleDarkMode}
            className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 dark:border-gray-700"
            aria-label="Toggle dark mode"
          >
            <span className="text-2xl">{darkMode ? '☀️' : '🌙'}</span>
          </button>
          
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
