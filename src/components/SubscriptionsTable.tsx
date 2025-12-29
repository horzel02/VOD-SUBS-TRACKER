import React, { useMemo } from "react";
import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Switch,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  Text,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, CheckIcon, RepeatIcon } from "@chakra-ui/icons";
import type { AppState } from "../types";
import { CategoryTag } from "./CategoryTag";
import { cycles } from "../utils/constants";
import { postPaymentForSub, revertLastPaymentForSub } from "../state/payments";

type Props = {
  data: AppState;
  setData: React.Dispatch<React.SetStateAction<AppState>>;
};

export const SubscriptionsTable: React.FC<Props> = ({ data, setData }) => {
  const toast = useToast();
  const { subs, categories } = data;

  const catById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

  const updateSub = (id: string, patch: Partial<AppState["subs"][number]>) => {
    setData((prev) => ({
      ...prev,
      subs: prev.subs.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const removeSub = (id: string) => {
    setData((prev) => ({ ...prev, subs: prev.subs.filter((s) => s.id !== id) }));
    toast({ title: "Usunięto subskrypcję", status: "info", duration: 1500 });
  };

  const markPaid = (id: string) => {
    setData((prev) => postPaymentForSub(prev, id));
    toast({ title: "Oznaczono jako opłacone", status: "success", duration: 1200 });
  };

  const undoLast = (id: string) => {
    setData((prev) => revertLastPaymentForSub(prev, id));
    toast({ title: "Cofnięto ostatnią płatność", status: "info", duration: 1200 });
  };

  const sorted = [...subs].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Box
      bg="white"
      p={3}
      rounded="2xl"
      shadow="sm"
      border="1px"
      borderColor="gray.100"
      _dark={{ bg: "gray.700", borderColor: "gray.600" }}
      overflowX="auto"
    >
      <Box minW="1150px">
        <Table size="md" sx={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 260 }} /> 
            <col style={{ width: 240 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 170 }} />
            <col style={{ width: 180 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 140 }} />
          </colgroup>

          <Thead>
            <Tr>
              <Th whiteSpace="nowrap">Nazwa</Th>
              <Th whiteSpace="nowrap">Kategoria</Th>
              <Th isNumeric whiteSpace="nowrap">Cena</Th>
              <Th whiteSpace="nowrap">Cykl</Th>
              <Th whiteSpace="nowrap">Nast. odnowienie</Th>
              <Th whiteSpace="nowrap" textAlign="center">
                Aktywna
              </Th>
              <Th whiteSpace="nowrap" textAlign="center">
                Akcje
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {sorted.map((s) => (
              <Tr key={s.id}>
                <Td whiteSpace="normal">
                  <Editable
                    defaultValue={s.name}
                    onSubmit={(v) => updateSub(s.id, { name: v })}
                  >
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                  {s.notes ? (
                    <Text fontSize="xs" color="gray.500" mt={1} whiteSpace="normal">
                      {s.notes}
                    </Text>
                  ) : null}
                </Td>

                <Td>
                  <HStack spacing={3} align="center">
                    <CategoryTag cat={catById[s.categoryId]} />
                    <Select
                      size="sm"
                      value={s.categoryId}
                      onChange={(e) => updateSub(s.id, { categoryId: e.target.value })}
                      w="100%"
                      height="32px"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </HStack>
                </Td>

                <Td isNumeric>
                  <NumberInput
                    size="sm"
                    value={s.price}
                    min={0}
                    precision={2}
                    step={1}
                    onChange={(_valStr, valNum) =>
                      updateSub(s.id, { price: Number.isFinite(valNum) ? valNum : 0 })
                    }
                    w="100%"
                  >
                    <NumberInputField textAlign="right" />
                  </NumberInput>
                </Td>

                <Td>
                  <Select
                    size="sm"
                    value={s.cycle}
                    onChange={(e) => updateSub(s.id, { cycle: e.target.value as any })}
                    w="100%"
                    height="32px"
                  >
                    {cycles.map((c) => (
                      <option value={c.value} key={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Select>
                </Td>

                <Td>
                  <Input
                    size="sm"
                    type="date"
                    value={s.nextRenewal}
                    onChange={(e) => updateSub(s.id, { nextRenewal: e.target.value })}
                    w="100%"
                    height="32px"
                  />
                </Td>

                <Td textAlign="center">
                  <Switch
                    isChecked={s.active}
                    onChange={(e) => updateSub(s.id, { active: e.target.checked })}
                  />
                </Td>
                
                <Td>
                  <HStack justify="center">
                    <Tooltip label="Oznacz opłacone">
                      <IconButton
                        aria-label="paid"
                        size="sm"
                        icon={<CheckIcon />}
                        onClick={() => markPaid(s.id)}
                      />
                    </Tooltip>

                    <Tooltip label="Cofnij ostatnią płatność">
                      <IconButton
                        aria-label="undo"
                        size="sm"
                        icon={<RepeatIcon />}
                        isDisabled={!data.payments.some((p) => p.subId === s.id && !p.reverted)}
                        onClick={() => undoLast(s.id)}
                      />
                    </Tooltip>

                    <Tooltip label="Usuń">
                      <IconButton
                        aria-label="delete"
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        icon={<DeleteIcon />}
                        onClick={() => removeSub(s.id)}
                      />
                    </Tooltip>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>

          <Tfoot>
            <Tr>
              <Th colSpan={7}>
                <Text fontSize="sm" color="gray.600">
                  {sorted.length} pozycji
                </Text>
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </Box>
    </Box>
  );
};
