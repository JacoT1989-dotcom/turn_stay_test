// components\questions\(question3-client-group)\question3-types.ts

export type Tx = {
  id: string;
  amount: number; // in minor units (cents)
  country: "ZA" | "US" | "EUR";
  paymentType: "card" | "bank" | "wallet";
  scheme?: "visa" | "mastercard" | "amex";
  createdAt: string; // ISO
  fee?: number;
};

export type Country = "All" | "ZA" | "US" | "EUR";
export type PaymentType = "All" | "card" | "bank" | "wallet";
