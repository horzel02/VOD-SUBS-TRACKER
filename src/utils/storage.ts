import { LS_KEY } from "./constants";
import type { AppState } from "../types";


export function saveState(state: AppState) {
localStorage.setItem(LS_KEY, JSON.stringify(state));
}


export function loadState(): AppState | null {
try {
const raw = localStorage.getItem(LS_KEY);
return raw ? (JSON.parse(raw) as AppState) : null;
} catch {
return null;
}
}