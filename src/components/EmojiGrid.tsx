import { SimpleGrid, Box, Text } from "@chakra-ui/react";
import EmojiCell from "./EmojiCell";
import type { EmojiItem } from "../utils/types";

type Props = {
    items: EmojiItem[];
    selectedSet: Set<string>;
    onCellClick: (index: number, e: React.MouseEvent) => void;
    glyphColor: string;
    fontFamily: string;
    cellSize?: number;
};

export default function EmojiGrid({
    items, selectedSet, onCellClick, glyphColor, fontFamily, cellSize = 84
}: Props) {
    return (
        <Box mt={4}>
            <SimpleGrid columns={[3, 6, 8, 10, 12]} spacing={2}>
                {items.map((it, idx) => (
                    <EmojiCell
                        key={it.filename}
                        char={it.char}
                        filename={it.filename}
                        selected={selectedSet.has(it.filename)}
                        onClick={(e) => onCellClick(idx, e)}
                        glyphColor={glyphColor}
                        fontFamily={fontFamily}
                        cellSize={cellSize}
                    />
                ))}
            </SimpleGrid>
            <Text mt={2} fontSize="sm" color="gray.600">
                Showing <b>{items.length}</b>
            </Text>
        </Box>
    );
}
