import React, { useRef } from "react";
import { Badge, Button, Flex, Heading, IconButton, Select, Spacer, Tooltip, useColorMode, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ArrowUpIcon, DownloadIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import type { AppState } from "../types";
import { currencySymbols } from "../utils/constants";


export const TopBar: React.FC<{
    data: AppState;
    setData: React.Dispatch<React.SetStateAction<AppState>>;
    onOpenAdd: () => void;
}> = ({ data, setData, onOpenAdd }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode();


    const exportJson = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vodsubs_${dayjs().format("YYYYMMDD_HHmm")}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };


    const importJson: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result));
                setData(parsed);
                toast({ title: "Zaimportowano dane", status: "success", duration: 1500 });
            } catch {
                toast({ title: "Nieprawidłowy plik", status: "error" });
            }
            if (fileRef.current) fileRef.current.value = "";
        };
        reader.readAsText(file);
    };


    return (
        <Flex align="center" gap={3}>
            <Heading size="md">VoD Sub Tracker</Heading>
            <Badge colorScheme="purple" rounded="full">Adam Horzela</Badge>
            <Spacer />
            <Tooltip label={colorMode === "light" ? "Tryb ciemny" : "Tryb jasny"}>
                <IconButton aria-label="theme" icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode} />
            </Tooltip>
            <Select w="110px" value={data.settings.mainCurrency}
                onChange={(e) => setData((p) => ({ ...p, settings: { ...p.settings, mainCurrency: e.target.value as any } }))}>
                {Object.keys(currencySymbols).map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </Select>
            <Tooltip label="Dodaj subskrypcję">
                <Button leftIcon={<AddIcon />} colorScheme="purple" onClick={onOpenAdd}>Dodaj</Button>
            </Tooltip>
        </Flex>
    );
};