import React from "react";
import { SubscriptionsTable } from "../components/SubscriptionsTable";
import type { AppState } from "../types";
import { motion } from "framer-motion";


export const ListPage: React.FC<{ data: AppState; setData: React.Dispatch<React.SetStateAction<AppState>>; }> = ({ data, setData }) => (
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
<SubscriptionsTable data={data} setData={setData} />
</motion.div>
);