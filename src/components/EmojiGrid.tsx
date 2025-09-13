import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Grid } from "react-window";
import EmojiCell from "./EmojiCell";
import type { IconItem } from "../utils/iconLibrary";

interface EmojiGridProps {
    items: IconItem[];
    slice: IconItem[];
    selectedSet: Set<string>;
    onCellClick: (idx: number, e: React.MouseEvent) => void;
    glyphColor: string;
    appBg?: string;
    appFg?: string;
    cellSize: number;
}

interface CellComponentProps {
    items: IconItem[];
    slice: IconItem[];
    selectedSet: Set<string>;
    onCellClick: (idx: number, e: React.MouseEvent) => void;
    glyphColor: string;
    cellSize: number;
    columnIndex?: number;
    rowIndex?: number;
    style?: React.CSSProperties;
}

function CellComponent(props: CellComponentProps) {
    const { slice, selectedSet, onCellClick, glyphColor, cellSize, columnIndex = 0, rowIndex = 0, style } = props;
    const columns = Math.max(1, Math.floor(window.innerWidth / (cellSize + 8)));
    const idx = rowIndex * columns + columnIndex;
    if (idx >= slice.length) return null;
    const it = slice[idx];
    if (it.type === "openmoji") {
        return (
            <div style={style} key={it.filename}>
                <EmojiCell
                    char={it.char || ""}
                    filename={it.filename || it.name}
                    selected={selectedSet.has(it.filename || it.name)}
                    onClick={(e) => onCellClick(idx, e)}
                    glyphColor={glyphColor}
                    fontFamily="OpenMojiBlack, system-ui, sans-serif"
                    cellSize={cellSize}
                />
            </div>
        );
    } else if (it.type === "fontawesome" || it.type === "react-icons") {
        const logPrefix = `[EmojiGrid Render]`;
        if (!it.iconComponent) {
            console.warn(`${logPrefix} Missing iconComponent for`, it.name, it);
            return null;
        }
        if (typeof it.iconComponent !== "function") {
            console.warn(`${logPrefix} iconComponent is not a function for`, it.name, it.iconComponent);
            return null;
        }
        let rendered: React.ReactElement | null = null;
        try {
            const result = it.iconComponent({});
            if (
                result &&
                typeof result === "object" &&
                "type" in result &&
                (typeof result.type === "function" || typeof result.type === "string")
            ) {
                rendered = result as React.ReactElement;
            } else {
                console.warn(`${logPrefix} Render result not a valid React element:`, it.name, result);
                return null;
            }
        } catch (e) {
            console.error(`${logPrefix} Error rendering icon`, it.name, e);
            return null;
        }
        return (
            <div style={style} key={it.name}>
                <Box
                    as="button"
                    title={it.name}
                    onClick={(e) => onCellClick(idx, e)}
                    w={`${cellSize}px`}
                    h={`${cellSize}px`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize={`${Math.max(24, Math.round(cellSize * 0.6))}px`}
                    color={glyphColor}
                >
                    {rendered}
                </Box>
            </div>
        );
    } else {
        return null;
    }
}

const EmojiGrid = ({
    items,
    slice,
    selectedSet,
    onCellClick,
    glyphColor,
    // appBg,
    // appFg,
    cellSize
}: EmojiGridProps) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }, [cellSize]);
    const columns = Math.max(1, Math.floor(containerWidth / (cellSize + 8)));

    return (
        <Box h="100%" display="flex" flexDirection="column" minH="0" minW="0" /* bg={appBg} color={appFg} */>
            <Box
                ref={el => {
                    scrollRef.current = el;
                    containerRef.current = el;
                }}
                flex="1"
                minH="0"
                minW="0"
                h="100%"
                overflow="auto"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="md"
                p={2}
            >
                <Grid
                    columnCount={columns}
                    rowCount={Math.ceil(slice.length / columns)}
                    columnWidth={cellSize + 8}
                    rowHeight={cellSize + 8}
                    // width={containerWidth}
                    // height={Math.min(600, Math.ceil(slice.length / columns) * (cellSize + 8))}
                    cellComponent={CellComponent}
                    cellProps={{ items, slice, selectedSet, onCellClick, glyphColor, cellSize }}
                />
            </Box>
        </Box>
    );
};

export default EmojiGrid;
