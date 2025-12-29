import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { defaultCategories } from "../utils/constants";
import { saveState, loadState } from "../utils/storage";
import type { AppState } from "../types";


const uid = () => Math.random().toString(36).slice(2);


function getDemo(): AppState {
    const today = dayjs();
    const subs = [
        { id: uid(), name: "Netflix", categoryId: "cat_vod", price: 43.0, currency: "PLN", cycle: "monthly", nextRenewal: today.add(5, "day").format("YYYY-MM-DD"), active: true, notes: "Plan Standard z reklamami" },
        { id: uid(), name: "HBO Max", categoryId: "cat_vod", price: 29.99, currency: "PLN", cycle: "monthly", nextRenewal: today.add(12, "day").format("YYYY-MM-DD"), active: true, notes: "Promka 12 m-cy" },
        { id: uid(), name: "Spotify", categoryId: "cat_music", price: 19.99, currency: "PLN", cycle: "monthly", nextRenewal: today.add(2, "day").format("YYYY-MM-DD"), active: true },
        { id: uid(), name: "Xbox Game Pass", categoryId: "cat_games", price: 49.99, currency: "PLN", cycle: "monthly", nextRenewal: today.add(20, "day").format("YYYY-MM-DD"), active: false },
        { id: uid(), name: "Canva Pro", categoryId: "cat_tools", price: 299.0, currency: "PLN", cycle: "yearly", nextRenewal: today.add(3, "month").format("YYYY-MM-DD"), active: true },
    ];
    return {
        subs,
        categories: defaultCategories,
        budget: {
            monthlyLimit: 150,
            byCategory: { cat_vod: 80, cat_music: 25, cat_games: 50, cat_tools: 40 },
        },
        settings: { mainCurrency: "PLN" },
        payments: [],
    };
}


export function usePersistentState(): [AppState, React.Dispatch<React.SetStateAction<AppState>>] {
    const [data, setData] = useState<AppState>(() => loadState() ?? getDemo());


    useEffect(() => {
        saveState(data);
    }, [data]);


    return [data, setData];
}