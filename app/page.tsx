// app/page.tsx
import HomeClient from "@/components/home-client";

export default function Home() {
  const questions = [
    {
      number: 1,
      title: "List all transactions",
      level: "Junior",
      description: "Render a table of transactions with proper formatting",
      href: "/transactions/question1",
    },
    {
      number: 2,
      title: "Split by currency",
      level: "Junior",
      description: "Add currency filter (tabs or dropdown)",
      href: "/transactions/question2",
    },
    {
      number: 3,
      title: "Further split by payment type",
      level: "Intermediate",
      description: "Combine currency and payment type filters",
      href: "/transactions/question3",
    },
    {
      number: 4,
      title: "Show generic fees and compute amounts",
      level: "Intermediate",
      description: "Display fee column with rate and amount calculations",
      href: "/transactions/question4",
    },
    {
      number: 5,
      title: "Display and prioritize overrides",
      level: "Intermediate → Senior",
      description: "Handle custom fee overrides with visual indicators",
      href: "/transactions/question5",
    },
    {
      number: 6,
      title: "Grouping + aggregates",
      level: "Senior",
      description:
        "Add grouped view with aggregates by currency, payment type, and scheme",
      href: "/transactions/question6",
    },
    {
      number: 7,
      title: "Server data, caching, and URL state",
      level: "Principal",
      description: "Move to server-side rendering with pagination and caching",
      href: "/transactions/question7",
    },
    {
      number: 8,
      title: "Multi-tenant fee policy + overrides matrix",
      level: "Principal",
      description: "Implement policy system with deterministic resolver",
      href: "/transactions/question8",
    },
  ];

  return <HomeClient questions={questions} />;
}
