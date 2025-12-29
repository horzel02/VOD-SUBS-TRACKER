import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import React from "react";


export const StatCard: React.FC<{ label: string; value: React.ReactNode; help?: string }> = ({ label, value, help }) => (
    <Stat p={4} bg="white" rounded="2xl" shadow="sm" border="1px" borderColor="gray.100" _dark={{ bg: "gray.700", borderColor: "gray.600" }}>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{value}</StatNumber>
        {help && <StatHelpText>{help}</StatHelpText>}
    </Stat>
);