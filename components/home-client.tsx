// components/home-client.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

interface Question {
  number: number;
  title: string;
  level: string;
  description: string;
  href: string;
}

interface HomeClientProps {
  questions: Question[];
}

export default function HomeClient({ questions }: HomeClientProps) {
  const [isDark, setIsDark] = useState(false);

  const getLevelColor = (level: string) => {
    if (level.includes("Junior")) return "bg-green-100 text-green-800";
    if (level.includes("Intermediate")) return "bg-yellow-100 text-yellow-800";
    if (level.includes("Senior")) return "bg-orange-100 text-orange-800";
    if (level.includes("Principal")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`fixed top-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isDark ? "bg-gray-700 text-yellow-400" : "bg-white text-gray-800"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        <header className="text-center mb-12">
          <h1
            className={`text-5xl font-bold mb-3 transition-colors ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Frontend Engineering Technical Interview
          </h1>
          <p
            className={`text-xl mb-2 transition-colors ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Transaction Management System
          </p>
          <p
            className={`text-lg italic transition-colors ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            by Jaco Thiart
          </p>
        </header>

        <div
          className={`rounded-xl shadow-2xl p-8 mb-8 transition-colors ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`text-3xl font-bold mb-4 transition-colors ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            Quick Setup
          </h2>
          <ul
            className={`space-y-2 ml-6 list-disc transition-colors ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <li>
              Building a Next.js (App Router) page at{" "}
              <code
                className={`px-2 py-1 rounded text-sm ${
                  isDark
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                /transactions
              </code>
            </li>
            <li>
              Data comes from an API (starting with hard-coded array, then
              evolving to fetching)
            </li>
            <li>Using React, TypeScript, and Tailwind CSS</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {questions.map((question) => (
            <Link key={question.number} href={question.href} className="group">
              <div
                className={`rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-3xl font-bold ${
                        isDark ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    >
                      Q{question.number}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(
                        question.level
                      )}`}
                    >
                      {question.level}
                    </span>
                  </div>
                  <svg
                    className={`w-6 h-6 transform group-hover:translate-x-1 transition-transform ${
                      isDark ? "text-indigo-400" : "text-indigo-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors ${
                    isDark
                      ? "text-gray-200 group-hover:text-indigo-400"
                      : "text-gray-800"
                  }`}
                >
                  {question.title}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {question.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div
          className={`mt-12 rounded-xl shadow-2xl p-8 transition-colors ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-4 transition-colors ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Scoring Bands
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 mt-1">
                Junior (1-2)
              </span>
              <p
                className={`flex-1 transition-colors ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Gets data on screen, basic filters, formatting, tidy React.
                Understands state and keys.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 mt-1">
                Intermediate (3-5)
              </span>
              <p
                className={`flex-1 transition-colors ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Composes filters, correct fee math, override precedence,
                introduces clean utility functions, thinks about testing and
                small perf wins.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 mt-1">
                Senior (5-6)
              </span>
              <p
                className={`flex-1 transition-colors ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Adds grouping/aggregations, reasons about large lists,
                separation of concerns, talks sensibly about when to move work
                server-side and how.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 mt-1">
                Principal (7-8)
              </span>
              <p
                className={`flex-1 transition-colors ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Designs URL-driven, cached, server-enhanced flows; builds a
                policy resolution system with explainability and clear
                precedence; discusses versioning, rollout, and observability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
