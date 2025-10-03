// components/questions/(question1-client-group)/question1-types.ts

export type Tx = {
  id: string;
  amount: number; // in minor units (cents)
  country: "ZA" | "US" | "EUR";
  paymentType: "card" | "bank" | "wallet";
  scheme?: "visa" | "mastercard" | "amex";
  createdAt: string; // ISO
  fee?: number;
};
