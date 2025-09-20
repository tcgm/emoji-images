import { Box, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { getFontForSource } from "../utils/fontUtils";
import { useState } from "react";

type Props = {
    char?: string;
    iconComponent?: React.ReactElement | null;
    filename: string;
    selected: boolean;
    onClick: (e: React.MouseEvent) => void;
    glyphColor: string;
    fontFamily: string;
    cellSize: number;
    name?: string;
    type?: string;
    keywords?: string[];
    source?: string;
};

export default function EmojiCell({
    char,
    iconComponent,
    filename,
    selected,
    onClick,
    glyphColor,
    fontFamily,
    cellSize,
    name,
    type,
    keywords,
    source
}: Props) {
    const computedFontFamily = getFontForSource(source || "");

    console.log("EmojiCell Debug:", { source, computedFontFamily });

    const borderColor = selected
        ? useColorModeValue("purple.500", "purple.300")
        : useColorModeValue("gray.200", "gray.700");
    const bgColor = selected
        ? useColorModeValue("purple.50", "purple.900")
        : useColorModeValue("white", "gray.800");
    const hoverBorderColor = useColorModeValue("purple.400", "purple.200");
    const tooltipLabel = (
        <Box textAlign="left">
            <strong>{name || filename}</strong><br />
            {type && <span>Type: {type}<br /></span>}
            {source && <span>Source: {source}<br /></span>}
            {/* {computedFontFamily && <span>Font Family: {computedFontFamily}<br /></span>} */}
            {keywords && keywords.length > 0 && <span>Keywords: {keywords.join(", ")}<br /></span>}
            {filename && <span>File: {filename}</span>}
        </Box>
    );

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const handleDoubleClick = () => {
        setTooltipOpen((prev) => !prev);
    };

    return (
        <Tooltip label={tooltipLabel} placement="top" hasArrow isOpen={tooltipOpen || undefined} closeOnClick={false} pointerEvents="auto">
            <Box className="emoji-cell"
                as="button"
                title={`${char || filename} — ${filename}`}
                onClick={onClick}
                onDoubleClick={handleDoubleClick}
                w={`${cellSize}px`}
                h={`${cellSize}px`}
                borderWidth={selected ? "2px" : "1px"}
                borderColor={borderColor}
                bg={bgColor}
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontFamily={computedFontFamily}
                fontSize={`${Math.max(24, Math.round(cellSize * 0.6))}px`}
                color={glyphColor}
                userSelect="none"
                _hover={{ borderColor: hoverBorderColor }}
            >
                {iconComponent ? iconComponent : char}
            </Box>
        </Tooltip>
    );
}