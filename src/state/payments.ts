import dayjs from "dayjs";
import type { AppState, Cycle } from "../types";

const rid = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const fmt = (d: dayjs.Dayjs | string | Date) => dayjs(d).format("YYYY-MM-DD");
const round2 = (n: number) => Math.round(n * 100) / 100;

const shift = (d: string, cycle: Cycle, dir: 1 | -1) =>
  cycle === "monthly"
    ? fmt(dayjs(d).add(dir, "month"))
    : fmt(dayjs(d).add(dir, "year"));

export function postPaymentForSub(state: AppState, subId: string): AppState {
  const sub = state.subs.find((s) => s.id === subId);
  if (!sub) return state;

  const payment = {
    id: rid(),
    subId: sub.id,
    name: sub.name,
    amount: round2(sub.price),
    currency: sub.currency,
    date: dayjs().toISOString(),
    cycle: sub.cycle,
    reverted: false,
  } as const;

  const next = shift(sub.nextRenewal, sub.cycle, 1);

  return {
    ...state,
    payments: [payment, ...state.payments],
    subs: state.subs.map((s) => (s.id === subId ? { ...s, nextRenewal: next } : s)),
  };
}


export function revertLastPaymentForSub(state: AppState, subId: string): AppState {
  const idx = state.payments.findIndex((p) => p.subId === subId && !p.reverted);
  if (idx === -1) return state;

  const target = state.payments[idx];
  const sub = state.subs.find((s) => s.id === subId);
  if (!sub) return state;

  const newPayments = [...state.payments];
  newPayments[idx] = { ...target, reverted: true };

  const prevDate = shift(sub.nextRenewal, target.cycle, -1);

  return {
    ...state,
    payments: newPayments,
    subs: state.subs.map((s) => (s.id === subId ? { ...s, nextRenewal: prevDate } : s)),
  };
}
