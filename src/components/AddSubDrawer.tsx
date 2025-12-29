import React, { useEffect, useState } from "react";
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    Select,
    Stack,
    Switch,
    useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import type { AppState, Subscription, Cycle } from "../types";
import { cycles } from "../utils/constants";

const uid = () => Math.random().toString(36).slice(2);

type Props = {
    isOpen: boolean;
    onClose: () => void;
    data: AppState;
    setData: React.Dispatch<React.SetStateAction<AppState>>;
};

export const AddSubDrawer: React.FC<Props> = ({ isOpen, onClose, data, setData }) => {
    const [form, setForm] = useState<Subscription>({
        id: "tmp",
        name: "",
        categoryId: data.categories[0]?.id,
        price: 0,
        currency: data.settings.mainCurrency,
        cycle: "monthly",
        nextRenewal: dayjs().format("YYYY-MM-DD"),
        active: true,
        notes: "",
    });
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            setForm((f: Subscription) => ({
                ...f,
                categoryId: (data.categories[0]?.id ?? f.categoryId) as string,
                currency: data.settings.mainCurrency,
            }));
        }
    }, [isOpen, data.categories, data.settings.mainCurrency]);

    const submit = () => {
        if (!form.name.trim()) {
            toast({ title: "Podaj nazwę subskrypcji", status: "warning" });
            return;
        }
        const toAdd: Subscription = { ...form, id: uid() };
        setData((prev) => ({ ...prev, subs: [...prev.subs, toAdd] }));
        toast({ title: "Dodano subskrypcję", status: "success", duration: 1500 });
        onClose();
    };

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Dodaj subskrypcję</DrawerHeader>
                <DrawerBody>
                    <Stack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Nazwa</FormLabel>
                            <Input
                                value={form.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setForm((f: Subscription) => ({ ...f, name: e.target.value }))
                                }
                                placeholder="np. Netflix"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Kategoria</FormLabel>
                            <Select
                                value={form.categoryId}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                    setForm((f: Subscription) => ({ ...f, categoryId: e.target.value }))
                                }
                            >
                                {data.categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Cena</FormLabel>
                            <NumberInput
                                value={form.price}
                                min={0}
                                precision={2}
                                step={1}
                                onChange={(_valueStr: string, valueNum: number) =>
                                    setForm((f: Subscription) => ({ ...f, price: Number.isFinite(valueNum) ? valueNum : 0 }))
                                }
                            >
                                <NumberInputField />
                            </NumberInput>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Waluta</FormLabel>
                            <Select
                                value={form.currency}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                    setForm((f: Subscription) => ({ ...f, currency: e.target.value as Subscription["currency"] }))
                                }
                            >
                                {(["PLN", "EUR", "USD"] as const).map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Cykl</FormLabel>
                            <Select
                                value={form.cycle}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                    setForm((f: Subscription) => ({ ...f, cycle: e.target.value as Cycle }))
                                }
                            >
                                {cycles.map((c) => (
                                    <option value={c.value} key={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Następne odnowienie</FormLabel>
                            <Input
                                type="date"
                                value={form.nextRenewal}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setForm((f: Subscription) => ({ ...f, nextRenewal: e.target.value }))
                                }
                            />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                            <FormLabel mb="0">Aktywna</FormLabel>
                            <Switch
                                isChecked={form.active}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setForm((f: Subscription) => ({ ...f, active: e.target.checked }))
                                }
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Notatki</FormLabel>
                            <Input
                                value={form.notes}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setForm((f: Subscription) => ({ ...f, notes: e.target.value }))
                                }
                                placeholder="np. plan, promocja, użytkownicy"
                            />
                        </FormControl>

                        <Button leftIcon={<AddIcon />} colorScheme="purple" onClick={submit}>
                            Dodaj
                        </Button>
                    </Stack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
