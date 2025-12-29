import React from "react";
import {
  Badge, Box, Heading, Table, Thead, Tr, Th, Tbody, Td, Text, HStack, IconButton, Tooltip,
} from "@chakra-ui/react";
import { RepeatIcon, DeleteIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import type { AppState } from "../types";
import { currencySymbols } from "../utils/constants";
import { postPaymentForSub, revertLastPaymentForSub } from "../state/payments";


type Props = {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
};

export const HistoryPage: React.FC<Props> = ({ data, setData }) => {
  const symbol = currencySymbols[data.settings.mainCurrency] || data.settings.mainCurrency;

  const toggleRevert = (id: string) => {
    setData(prev => ({
      ...prev,
      payments: prev.payments.map(p => p.id === id ? { ...p, reverted: !p.reverted } : p),
    }));
  };

  const isLatestUnrevertedForSub = (paymentId: string) => {
    const p = data.payments.find(x => x.id === paymentId);
    if (!p) return false;
    const newestIdx = data.payments.findIndex(x => x.subId === p.subId && !x.reverted);
    return newestIdx !== -1 && data.payments[newestIdx].id === paymentId;
  };

  const undoById = (id: string) => {
    const p = data.payments.find(x => x.id === id);
    if (!p) return;
    setData(prev => revertLastPaymentForSub(prev, p.subId));
  };

  const removePayment = (id: string) => {
    setData(prev => ({
      ...prev,
      payments: prev.payments.filter(p => p.id !== id),
    }));
  };

  return (
    <Box bg="white" border="1px" borderColor="gray.100" _dark={{ bg: "gray.700", borderColor: "gray.600" }} p={4} rounded="2xl">
      <Heading size="sm" mb={3}>Historia płatności</Heading>

      {data.payments.length === 0 ? (
        <Text color="gray.500">Brak wpisów. Oznacz płatność jako opłaconą na liście subskrypcji.</Text>
      ) : (
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Data</Th><Th>Nazwa</Th><Th isNumeric>Kwota</Th><Th>Waluta</Th><Th>Cykl</Th><Th>Stan</Th><Th>Akcje</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.payments.map((p) => {
              const lineThrough = p.reverted ? "line-through" : "none";
              const color = p.reverted ? "gray.400" : undefined;
              return (
                <Tr key={p.id}>
                  <Td color={color} textDecoration={lineThrough}>{dayjs(p.date).format("YYYY-MM-DD HH:mm")}</Td>
                  <Td color={color} textDecoration={lineThrough}>{p.name}</Td>
                  <Td isNumeric color={color} textDecoration={lineThrough}>{Number(p.amount).toFixed(2)}</Td>
                  <Td color={color} textDecoration={lineThrough}>{p.currency}</Td>
                  <Td color={color} textDecoration={lineThrough}>{p.cycle === "monthly" ? "Miesięcznie" : "Rocznie"}</Td>
                  <Td>{p.reverted ? <Badge colorScheme="gray">Cofnięto</Badge> : <Badge colorScheme="green">ZAKSIĘGOWANO</Badge>}</Td>
                  <Td>
                    <HStack>
                      <Tooltip label={p.reverted ? "Już cofnięto" : (isLatestUnrevertedForSub(p.id) ? "Cofnij" : "Cofnij (niedostępne – nie jest najnowsza)")}>
                        <IconButton
                          aria-label="toggle"
                          size="sm"
                          icon={<RepeatIcon />}
                          isDisabled={p.reverted || !isLatestUnrevertedForSub(p.id)}
                          onClick={(e) => { e.stopPropagation(); undoById(p.id); }}
                        />
                      </Tooltip>

                      <Tooltip label="Usuń">
                        <IconButton
                          aria-label="delete"
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          icon={<DeleteIcon />}
                          onClick={(e) => { e.stopPropagation(); removePayment(p.id); }}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>

                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};
