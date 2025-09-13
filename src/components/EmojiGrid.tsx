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
    if (idx >= slice.length) {
        // Do not render anything for empty cells
        return null;//<div style={{ background: "#FFD2D2", color: "#B22222", padding: "8px", textAlign: "center" }}>Empty cell</div>;
    }
    const it = slice[idx];
    let iconComponent: React.ReactElement | null = null;
    if (it.iconComponent && (it.type === "fontawesome" || it.type === "react-icons")) {
        try {
            const result = it.iconComponent({});
            if (
                result &&
                typeof result === "object" &&
                "type" in result &&
                (typeof result.type === "function" || typeof result.type === "string")
            ) {
                iconComponent = result as React.ReactElement;
            }
        } catch (e) {
            iconComponent = null;
        }
    }
    return (
        <div style={style} key={it.filename || it.name}>
            <EmojiCell
                char={it.char || ""}
                iconComponent={iconComponent}
                filename={it.filename || it.name}
                selected={selectedSet.has(it.filename || it.name)}
                onClick={(e) => onCellClick(idx, e)}
                glyphColor={glyphColor}
                fontFamily="OpenMojiBlack, system-ui, sans-serif"
                cellSize={cellSize}
                name={it.name}
                type={it.type}
                keywords={it.keywords}
            />
        </div>
    );
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
    // Only calculate columns if containerWidth is valid
    const minColumns = 3;
    const columns = containerWidth > 0 ? Math.max(minColumns, Math.floor(containerWidth / (cellSize + 8))) : minColumns;
    // Calculate number of rows safely
    const numRows = columns > 0 ? Math.ceil(slice.length / columns) : 0;
    // Cap grid height to 80vh for scrollable area
    const cappedHeight = numRows > 0 ? Math.min(numRows * (cellSize + 8), window.innerHeight * 0.8) : 0;

    // Log the count of items in slice the first time EmojiGrid renders
    const hasLogged = useRef(false);
    useEffect(() => {
        if (!hasLogged.current && typeof window !== "undefined") {
            console.log("EmojiGrid initial slice count:", slice.length);
            hasLogged.current = true;
        }
    }, [slice.length]);

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
                maxH="80vh"
            >
                {containerWidth > 0 && columns > 0 && numRows > 0 && (
                    <Grid className="emoji-grid"
                        columnCount={columns}
                        rowCount={numRows}
                        columnWidth={cellSize + 8}
                        rowHeight={cellSize + 8}
                        defaultWidth={containerWidth}
                        //defaultHeight={cappedHeight}
                        cellComponent={CellComponent}
                        cellProps={{ items, slice, selectedSet, onCellClick, glyphColor, cellSize }}
                    />
                )}
            </Box>
        </Box>
    );
};

export default EmojiGrid;
