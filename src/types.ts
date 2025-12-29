export type Cycle = "monthly" | "yearly";
export type Currency = "PLN" | "EUR" | "USD";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Subscription {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  currency: Currency;
  cycle: Cycle;
  nextRenewal: string; // YYYY-MM-DD
  active: boolean;
  notes?: string;
}

export interface Payment {
  id: string;
  subId: string;
  name: string;
  amount: number;
  currency: Currency;
  date: string;
  cycle: Cycle;
  reverted?: boolean;
}

export interface AppState {
  subs: Subscription[];
  categories: Category[];
  budget: {
    monthlyLimit: number;
    byCategory: Record<string, number>;
  };
  settings: { mainCurrency: Currency };
  payments: Payment[];
}
