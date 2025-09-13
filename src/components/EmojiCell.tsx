import { Box, useColorModeValue } from "@chakra-ui/react";

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
    char,
    filename,
    selected,
    onClick,
    glyphColor,
    fontFamily,
    cellSize
}: Props) {
    const borderColor = selected
        ? useColorModeValue("purple.500", "purple.300")
        : useColorModeValue("gray.200", "gray.700");
    const bgColor = selected
        ? useColorModeValue("purple.50", "purple.900")
        : useColorModeValue("white", "gray.800");
    const hoverBorderColor = useColorModeValue("purple.400", "purple.200");
    return (
        <Box
            as="button"
            title={`${char} — ${filename}`}
            onClick={onClick}
            w={`${cellSize}px`}
            h={`${cellSize}px`}
            borderWidth={selected ? "2px" : "1px"}
            borderColor={borderColor}
            bg={bgColor}
            rounded="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontFamily={`"${fontFamily}", "OpenMojiBlack", sans-serif`}
            fontSize={`${Math.max(24, Math.round(cellSize * 0.6))}px`}
            color={glyphColor}
            userSelect="none"
            _hover={{ borderColor: hoverBorderColor }}
        >
            {char}
        </Box>
    );
}
