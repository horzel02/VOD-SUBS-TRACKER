// src/components/CategoryTag.tsx
import { Badge } from "@chakra-ui/react";

export const CategoryTag = ({ cat }: { cat?: { name: string; color: string } }) => {
  if (!cat) return null;
  return (
    <Badge
      px="2.5"
      py="0.5"
      rounded="full"
      fontSize="xs"
      bg={cat.color}
      color="white"
      maxW="140px"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      flexShrink={0}
    >
      {cat.name}
    </Badge>
  );
};
