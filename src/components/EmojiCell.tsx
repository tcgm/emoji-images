import { Box } from "@chakra-ui/react";

type Props = {
    char: string;
    filename: string;
    selected: boolean;
    onClick: (e: React.MouseEvent) => void;
    glyphColor: string;
    fontFamily: string;
    cellSize: number;
};

export default function EmojiCell({
    char, filename, selected, onClick, glyphColor, fontFamily, cellSize
}: Props) {
    return (
        <Box
            as="button"
            title={`${char} — ${filename}`}
            onClick={onClick}
            w={`${cellSize}px`}
            h={`${cellSize}px`}
            borderWidth={selected ? "2px" : "1px"}
            borderColor={selected ? "purple.500" : "gray.200"}
            bg={selected ? "purple.50" : "white"}
            rounded="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontFamily={`"${fontFamily}", "OpenMojiBlack", sans-serif`}
            fontSize={`${Math.max(24, Math.round(cellSize * 0.6))}px`}
            color={glyphColor}
            userSelect="none"
            _hover={{ borderColor: "purple.400" }}
        >
            {char}
        </Box>
    );
}
