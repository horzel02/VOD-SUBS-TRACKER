import React, { useMemo } from "react";
import { Box, Heading, HStack, NumberInput, NumberInputField, Progress, SimpleGrid, Text } from "@chakra-ui/react";
import type { AppState } from "../types";
import { computeMonthlyCost } from "../utils/money";
import { currencySymbols } from "../utils/constants";
import { CategoryTag } from "./CategoryTag";


export const BudgetPanel: React.FC<{ data: AppState; setData: React.Dispatch<React.SetStateAction<AppState>>; }> = ({ data, setData }) => {
     const { categories, subs, budget, settings } = data;
     const mainCur = settings.mainCurrency;
     const symbol = currencySymbols[mainCur] || mainCur;


     const perCat = useMemo(() => {
          const map = new Map<string, number>();
          categories.forEach((c) => map.set(c.id, 0));
          subs.forEach((s) => map.set(s.categoryId, (map.get(s.categoryId) || 0) + computeMonthlyCost(s)));
          return Object.fromEntries(map);
     }, [subs, categories]);


     const setMonthlyLimit = (v: string) => setData((prev) => ({ ...prev, budget: { ...prev.budget, monthlyLimit: Number(v) } }));
     const setCatLimit = (catId: string, v: string) => setData((prev) => ({ ...prev, budget: { ...prev.budget, byCategory: { ...prev.budget.byCategory, [catId]: Number(v) } } }));


     return (
          <>
               <Box bg="white" border="1px" borderColor="gray.100"
                    _dark={{ bg: "gray.700", borderColor: "gray.600" }}>

                    <Heading size="sm" mb={3}>Limit miesięczny</Heading>
                    <HStack>
                         <NumberInput value={budget?.monthlyLimit ?? 0} min={0} precision={2} step={5} onChange={(v) => setMonthlyLimit(v)} maxW="200px">
                              <NumberInputField />
                         </NumberInput>
                         <Text>{symbol}</Text>
                    </HStack>
               </Box>


               <SimpleGrid columns={[1, 2, 2, 3]} spacing={4} mt={4}>
                    {categories.map((c) => {
                         const used = (perCat as any)[c.id] || 0;
                         const limit = data.budget?.byCategory?.[c.id] ?? 0;
                         const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
                         return (
                              <Box bg="white" border="1px" borderColor="gray.100"
                                   _dark={{ bg: "gray.700", borderColor: "gray.600" }}>
                                   <HStack justify="space-between" mb={2}>
                                        <CategoryTag cat={c} />
                                        <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }}>{used.toFixed(2)} {symbol}</Text>
                                   </HStack>
                                   <Progress value={pct} rounded="full" mb={2} />
                                   <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }} mb={2}>{limit ? `${pct}% limitu` : "Brak limitu"}</Text>
                                   <HStack>
                                        <NumberInput value={limit} min={0} precision={2} step={5} onChange={(v) => setCatLimit(c.id, v)} maxW="160px">
                                             <NumberInputField />
                                        </NumberInput>
                                        <Text>{symbol}</Text>
                                   </HStack>
                              </Box>
                         );
                    })}
               </SimpleGrid>
          </>
     );
};