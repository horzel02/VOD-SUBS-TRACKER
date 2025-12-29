import React from "react";
import { CategoryManager } from "../components/CategoryManager";
import type { AppState } from "../types";
import { motion } from "framer-motion";


export const SettingsPage: React.FC<{ data: AppState; setData: React.Dispatch<React.SetStateAction<AppState>>; }> = ({ data, setData }) => (
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
<CategoryManager data={data} setData={setData} />
</motion.div>
);