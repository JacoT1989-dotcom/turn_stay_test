// app/transactions/question8/page.tsx
import { Suspense } from "react";
import Question8Client from "@/components/questions/(question8-client-group)/question8-client";

function Question8Loading() {
  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl shadow-2xl p-8 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Question8Page() {
  return (
    <Suspense fallback={<Question8Loading />}>
      <Question8Client />
    </Suspense>
  );
}

export const metadata = {
  title: "Question 8 - Multi-Tenant Fee Policy",
  description:
    "Policy resolution system with explainability and conflict detection",
};
