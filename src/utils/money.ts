import type { Subscription } from "../types";


export function computeMonthlyCost(sub: {
  price: number;
  active: boolean;
  cycle: "monthly" | "yearly";
}) {
  const p = Number(sub.price || 0);
  if (!p || !sub.active) return 0;
  const val = sub.cycle === "yearly" ? p / 12 : p;
  return Number(val.toFixed(2));
}

