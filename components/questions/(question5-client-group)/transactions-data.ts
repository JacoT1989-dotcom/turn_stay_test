// components/questions/(question5-client-group)/transactions-data.ts

import { Tx } from "../shared-types";

export const transactions: Tx[] = [
  {
    id: "t_1",
    amount: 125000,
    country: "ZA",
    paymentType: "card",
    scheme: "visa",
    createdAt: "2025-09-10T10:00:00Z",
  },
  {
    id: "t_2",
    amount: 56000,
    country: "US",
    paymentType: "card",
    scheme: "mastercard",
    createdAt: "2025-09-11T12:15:00Z",
    hasCustomFee: true, // This transaction has a custom fee override
  },
  {
    id: "t_3",
    amount: 99000,
    country: "ZA",
    paymentType: "bank",
    createdAt: "2025-09-12T09:30:00Z",
  },
  {
    id: "t_4",
    amount: 45000,
    country: "EUR",
    paymentType: "wallet",
    createdAt: "2025-09-12T10:05:00Z",
  },
  {
    id: "t_5",
    amount: 200000,
    country: "ZA",
    paymentType: "card",
    scheme: "amex",
    createdAt: "2025-09-12T12:00:00Z",
  },
];
