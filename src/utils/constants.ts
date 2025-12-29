export const LS_KEY = "vodsubs_data_v2";


export const cycles = [
{ value: "monthly", label: "Miesięcznie" },
{ value: "yearly", label: "Rocznie" },
] as const;


export const currencySymbols: Record<string, string> = { PLN: "zł", EUR: "€", USD: "$" };


export const defaultCategories = [
{ id: "cat_vod", name: "VoD", color: "#805AD5" },
{ id: "cat_music", name: "Muzyka", color: "#38B2AC" },
{ id: "cat_games", name: "Gry", color: "#F6AD55" },
{ id: "cat_tools", name: "Narzędzia", color: "#E53E3E" },
];