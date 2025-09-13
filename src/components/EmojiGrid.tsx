import { useEffect, useMemo, useRef, useState } from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
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

const requestIdle = (cb: () => void) => {
    if ("requestIdleCallback" in window) (window as any).requestIdleCallback(cb, { timeout: 50 });
    else setTimeout(cb, 16);
};

export default function EmojiGrid({
    items, selectedSet, onCellClick, glyphColor, fontFamily, cellSize = 84
}: Props) {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // incremental render
    const INITIAL = 200, STEP_IDLE = 200, STEP_SCROLL = 400;
    const [visible, setVisible] = useState(INITIAL);

    useEffect(() => {
        setVisible(INITIAL);
        let cancel = false;
        const tick = () =>
            requestIdle(() => {
                if (cancel) return;
                setVisible(v => (v < items.length ? Math.min(items.length, v + STEP_IDLE) : v));
                if (!cancel) tick();
            });
        tick();
        return () => { cancel = true; };
    }, [items]);

    const onScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const near = el.scrollTop + el.clientHeight >= el.scrollHeight - 200;
        if (near) setVisible(v => Math.min(items.length, v + STEP_SCROLL));
    };

    const slice = useMemo(() => items.slice(0, visible), [items, visible]);

    return (
        // Wrapper fills the height it gets from App.tsx
        <Box h="100%" display="flex" flexDirection="column" minH="0" minW="0">
            {/* Only this inner box scrolls */}
            <Box
                ref={scrollRef}
                flex="1"
                minH="0"
                overflowY="auto"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="md"
                p={2}
                onScroll={onScroll}
            >
                <SimpleGrid columns={[3, 6, 8, 10, 12]} spacing={2}>
                    {slice.map((it, idx) => (
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
            </Box>

            <Text mt={2} fontSize="sm" color="gray.600">
                Showing <b>{slice.length}</b> of <b>{items.length}</b>
            </Text>
        </Box>
    );
}
