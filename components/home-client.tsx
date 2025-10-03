// components/home-client.tsx
"use client";

import Link from "next/link";

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
  const getLevelColor = (level: string) => {
    if (level.includes("Junior"))
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (level.includes("Intermediate"))
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    if (level.includes("Senior"))
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    if (level.includes("Principal"))
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 text-gray-800 dark:text-white">
            Frontend Engineering Technical Interview
          </h1>
          <p className="text-xl mb-2 text-gray-600 dark:text-gray-300">
            Transaction Management System
          </p>
          <p className="text-lg italic text-gray-500 dark:text-gray-400">
            by Jaco Thiart
          </p>
        </header>

        <div className="rounded-xl shadow-2xl p-8 mb-8 bg-white dark:bg-gray-800">
          <h2 className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Quick Setup
          </h2>
          <ul className="space-y-2 ml-6 list-disc text-gray-700 dark:text-gray-300">
            <li>
              Building a Next.js (App Router) page at{" "}
              <code className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
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
              <div className="rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
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
                    className="w-6 h-6 transform group-hover:translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400"
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
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {question.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {question.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-xl shadow-2xl p-8 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Scoring Bands
          </h2>
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-2">
                Junior (1-2)
              </span>
              <p className="text-gray-700 dark:text-gray-300">
                Gets data on screen, basic filters, formatting, tidy React.
                Understands state and keys.
              </p>
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mb-2">
                Intermediate (3-5)
              </span>
              <p className="text-gray-700 dark:text-gray-300">
                Composes filters, correct fee math, override precedence,
                introduces clean utility functions, thinks about testing and
                small perf wins.
              </p>
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 mb-2">
                Senior (5-6)
              </span>
              <p className="text-gray-700 dark:text-gray-300">
                Adds grouping/aggregations, reasons about large lists,
                separation of concerns, talks sensibly about when to move work
                server-side and how.
              </p>
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mb-2">
                Principal (7-8)
              </span>
              <p className="text-gray-700 dark:text-gray-300">
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
