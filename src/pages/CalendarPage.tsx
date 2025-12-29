import React from "react";
import { RenewalsCalendar } from "../components/RenewalsCalendar";
import type { AppState } from "../types";
import { motion } from "framer-motion";


export const CalendarPage: React.FC<{ data: AppState }> = ({ data }) => (
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
<RenewalsCalendar data={data} />
</motion.div>
);