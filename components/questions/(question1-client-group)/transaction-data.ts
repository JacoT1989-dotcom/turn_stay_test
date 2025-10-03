// data/transactions.ts

import { Tx } from "./question1-types";

export const transactions: Tx[] = [
  {
    id: "t_1",
    amount: 125000,
    currency: "ZAR",
    paymentType: "card",
    scheme: "visa",
    createdAt: "2025-09-10T10:00:00Z",
  },
  {
    id: "t_2",
    amount: 56000,
    currency: "USD",
    paymentType: "card",
    scheme: "mastercard",
    createdAt: "2025-09-11T12:15:00Z",
    fee: 290,
  },
  {
    id: "t_3",
    amount: 99000,
    currency: "ZAR",
    paymentType: "bank",
    createdAt: "2025-09-12T09:30:00Z",
  },
  {
    id: "t_4",
    amount: 45000,
    currency: "EUR",
    paymentType: "wallet",
    createdAt: "2025-09-12T10:05:00Z",
  },
  {
    id: "t_5",
    amount: 200000,
    currency: "ZAR",
    paymentType: "card",
    scheme: "amex",
    createdAt: "2025-09-12T12:00:00Z",
  },
];
