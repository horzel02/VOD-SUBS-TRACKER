import React from "react";
import { Dashboard } from "../components/Dashboard";
import type { AppState } from "../types";
import { motion } from "framer-motion";


export const DashboardPage: React.FC<{ data: AppState }> = ({ data }) => (
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
<Dashboard data={data} />
</motion.div>
);