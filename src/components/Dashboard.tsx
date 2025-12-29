import React, { useMemo } from "react";
import { Box, Heading, Progress, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Legend, Tooltip as RTooltip
} from "recharts";
import { StatCard } from "./StatCard";
import type { AppState } from "../types";
import { computeMonthlyCost } from "../utils/money";
import { currencySymbols } from "../utils/constants";
import dayjs from "dayjs";

export const Dashboard: React.FC<{ data: AppState }> = ({ data }) => {
  const { subs, categories, budget, settings } = data;
  const mainCur = settings.mainCurrency;
  const symbol = currencySymbols[mainCur] || mainCur;

  const monthlySum = useMemo(
    () => Number(subs.reduce((acc, s) => acc + computeMonthlyCost(s), 0).toFixed(2)),
    [subs]
  );

  const perCat = useMemo(() => {
    const map = new Map<string, number>();
    categories.forEach((c) => map.set(c.id, 0));
    subs.forEach((s) => {
      const v = computeMonthlyCost(s);
      map.set(s.categoryId, Number(((map.get(s.categoryId) || 0) + v).toFixed(2)));
    });
    return categories.map((c) => ({
      name: c.name,
      value: Number((map.get(c.id) || 0).toFixed(2)),
      color: c.color,
    }));
  }, [subs, categories]);

  const monthlySeries = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      month: dayjs().add(i, "month").format("MMM"),
      cost: monthlySum,
    }));
  }, [monthlySum]);

  const budgetUsage = budget?.monthlyLimit
    ? Math.min(100, Math.round((monthlySum / budget.monthlyLimit) * 100))
    : 0;

  return (
    <Stack spacing={6}>
      <SimpleGrid columns={[1, 2, 4]} spacing={4}>
        <StatCard label="Miesięczny koszt" value={`${monthlySum.toFixed(2)} ${symbol}`} help="Suma aktywnych subskrypcji" />
        <StatCard label="Liczba subów" value={subs.length} />
        <StatCard label="Aktywne" value={subs.filter((s) => s.active).length} />
        <StatCard label="Limit budżetu" value={budget?.monthlyLimit ? `${Number(budget.monthlyLimit).toFixed(2)} ${symbol}` : "—"} />
      </SimpleGrid>

      {budget?.monthlyLimit ? (
        <Box bg="white" p={4} rounded="2xl" shadow="sm" border="1px" borderColor="gray.100"
             _dark={{ bg: "gray.700", borderColor: "gray.600", color: "gray.300" }}>
          <Text mb={2}>Wykorzystanie budżetu miesięcznego</Text>
          <Progress value={budgetUsage} rounded="full" />
          <SimpleGrid columns={2} mt={2} fontSize="sm">
            <Text>{`${monthlySum.toFixed(2)} ${symbol}`}</Text>
            <Text textAlign="right">{`${Number(budget.monthlyLimit).toFixed(2)} ${symbol}`}</Text>
          </SimpleGrid>
        </Box>
      ) : null}

      <SimpleGrid columns={[1, 1, 2]} spacing={4}>
        <Box bg="white" p={4} rounded="2xl" shadow="sm" border="1px" borderColor="gray.100" minH="320px"
             _dark={{ bg: "gray.700", borderColor: "gray.600" }}>
          <Heading size="sm" mb={3}>Udział kosztów wg kategorii</Heading>
          <Box w="100%" h="260px">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={perCat}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label={({ value }) => Number(value).toFixed(2)}
                >
                  {perCat.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Legend />
                <RTooltip formatter={(v: any) => `${Number(v).toFixed(2)} ${symbol}`} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box bg="white" p={4} rounded="2xl" shadow="sm" border="1px" borderColor="gray.100" minH="320px"
             _dark={{ bg: "gray.700", borderColor: "gray.600" }}>
          <Heading size="sm" mb={3}>Prognoza 6 m-cy</Heading>
          <Box w="100%" h="260px">
            <ResponsiveContainer>
              <BarChart data={monthlySeries}>
                <XAxis dataKey="month" />
                <YAxis />
                <Legend />
                <RTooltip formatter={(v: any) => `${Number(v).toFixed(2)} ${symbol}`} />
                <Bar dataKey="cost" name="Koszt" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </SimpleGrid>
    </Stack>
  );
};
