import React, { useState } from "react";
import { Box, Button, Divider, Editable, EditableInput, EditablePreview, Flex, Heading, HStack, IconButton, Input, SimpleGrid, useToast } from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import type { AppState } from "../types";


const uid = () => Math.random().toString(36).slice(2);


export const CategoryManager: React.FC<{ data: AppState; setData: React.Dispatch<React.SetStateAction<AppState>>; }> = ({ data, setData }) => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#805AD5");
    const toast = useToast();


    const addCat = () => {
        if (!name) return;
        const id = `cat_${uid()}`;
        setData((prev) => ({ ...prev, categories: [...prev.categories, { id, name, color }] }));
        setName("");
        toast({ title: "Dodano kategorię", status: "success", duration: 1200 });
    };


    const rename = (id: string, newName: string) => setData((prev) => ({ ...prev, categories: prev.categories.map((c) => (c.id === id ? { ...c, name: newName } : c)) }));
    const recolor = (id: string, newColor: string) => setData((prev) => ({ ...prev, categories: prev.categories.map((c) => (c.id === id ? { ...c, color: newColor } : c)) }));
    const remove = (id: string) => setData((prev) => ({ ...prev, categories: prev.categories.filter((c) => c.id !== id) }));


    return (
        <Box bg="white" p={4} rounded="2xl" shadow="sm" border="1px" borderColor="gray.100" _dark={{ bg: "gray.700", borderColor: "gray.600" }}>
            <Heading size="sm" mb={3}>Kategorie</Heading>
            <SimpleGrid columns={[1, 2, 3]} spacing={3} mb={4}>
                {data.categories.map((c) => (
                    <Flex key={c.id} p={3} rounded="xl" border="1px" borderColor="gray.100" _dark={{ borderColor: "gray.600" }} align="center" gap={3}>
                        <Box w="20px" h="20px" rounded="full" bg={c.color} />
                        <Editable defaultValue={c.name} onSubmit={(v) => rename(c.id, v)} flex={1}>
                            <EditablePreview />
                            <EditableInput />
                        </Editable>
                        <Input type="color" value={c.color} onChange={(e) => recolor(c.id, e.target.value)} w="60px" p={0} />
                        <IconButton aria-label="remove" icon={<DeleteIcon />} size="sm" onClick={() => remove(c.id)} />
                    </Flex>
                ))}
            </SimpleGrid>


            <Divider mb={3} />
            <HStack>
                <Input placeholder="Nazwa kategorii" value={name} onChange={(e) => setName(e.target.value)} />
                <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} w="60px" p={0} />
                <Button onClick={addCat} leftIcon={<AddIcon />}>Dodaj</Button>
            </HStack>
        </Box>
    );
};