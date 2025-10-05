// app/transactions/question1/page.tsx
import Question1Client from "@/components/questions/(question1-client-group)/question1-client";

export default function Question1Page() {
  return <Question1Client />;
}

export const metadata = {
  title: "Question 1",
  description: "Interactive transaction filtering by country and payment type",
};
