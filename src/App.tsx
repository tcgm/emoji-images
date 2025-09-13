import { Box, Container, Flex, Progress } from "@chakra-ui/react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEmojiData } from "./hooks/useEmojiData";
import { useEnsureFont } from "./hooks/useFont";
import { useSelection } from "./hooks/useSelection";
import { drawEmojiToCanvas } from "./utils/canvas";
import { zipBlobs } from "./utils/zip";
import type { EmojiItem } from "./utils/types";
import Toolbar from "./components/Toolbar";
import PreviewCard from "./components/PreviewCard";
import EmojiGrid from "./components/EmojiGrid";

export default function App() {
    // Data
    const { meta, items, totalCount } = useEmojiData();

    // Generator settings
    const [yOffset, setYOffset] = useState(-10);
    const [canvasSize, setCanvasSize] = useState(200);
    const [fontSize, setFontSize] = useState(160);
    const [glyphColor, setGlyphColor] = useState("#ffffff");
    const fontFamily = "OpenMojiBlack";

    // Filtering
    const [query, setQuery] = useState("");
    const filtered: EmojiItem[] = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        const tokens = q.split(/\s+/g).filter(Boolean);
        return items.filter((it) =>
            tokens.every((t) => it.filename.includes(t) || it.char.toLowerCase().includes(t))
        );
    }, [items, query]);

    // Selection
    const { selected, toggle, rangeAdd, rememberIndex, lastIndex, clear, selectAll } = useSelection();
    const onCellClick = (index: number, e: React.MouseEvent) => {
        const keys = filtered.map((f) => f.filename);
        if (e.shiftKey && lastIndex() !== null) {
            rangeAdd(lastIndex()!, index, keys);
        } else {
            toggle(filtered[index]!.filename);
            rememberIndex(index);
        }
    };

    // Preview
    const previewRef = useRef<HTMLCanvasElement | null>(null);
    const ensureFont = useEnsureFont();
    const [demo, setDemo] = useState("🤒");
    const drawPreview = useCallback(async () => {
        if (!previewRef.current) return;
        await ensureFont(fontFamily, fontSize);
        drawEmojiToCanvas(
            previewRef.current, canvasSize, demo, fontSize, yOffset, fontFamily, glyphColor
        );
    }, [canvasSize, demo, ensureFont, fontFamily, fontSize, glyphColor, yOffset]);
    useEffect(() => { void drawPreview(); }, [drawPreview]);

    // Downloads
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState(0);
    const offscreenRef = useRef<HTMLCanvasElement | null>(null);

    const makeZipFrom = useCallback(async (source: EmojiItem[]) => {
        if (!offscreenRef.current) return;
        setBusy(true); setProgress(0); NProgress.start();

        await ensureFont(fontFamily, fontSize);
        const off = offscreenRef.current!;
        const batch = 120;
        const blobs: Array<{ name: string; blob: Blob }> = [];

        for (let i = 0; i < source.length; i += batch) {
            const part = source.slice(i, i + batch);
            await Promise.all(part.map(async (it) => {
                drawEmojiToCanvas(off, canvasSize, it.char, fontSize, yOffset, fontFamily, glyphColor);
                const blob = await new Promise<Blob>((res) => off.toBlob((b) => res(b as Blob), "image/png"));
                blobs.push({ name: it.filename, blob });
            }));
            setProgress(Math.min(1, (i + part.length) / source.length));
            await new Promise((r) => setTimeout(r, 0));
        }

        const zipBlob = await zipBlobs(blobs);
        NProgress.done(); setBusy(false);
        const a = document.createElement("a");
        a.download = `emojis_${meta?.sequencesVersion ?? "v"}_${meta?.sequencesDate ?? "date"}.zip`;
        a.href = URL.createObjectURL(zipBlob);
        a.click();
        URL.revokeObjectURL(a.href);
    }, [canvasSize, ensureFont, fontFamily, fontSize, glyphColor, meta, yOffset]);

    const onDownloadSelected = () => {
        if (!selected.size) return;
        const setSel = new Set(selected);
        makeZipFrom(filtered.filter((it) => setSel.has(it.filename)));
    };
    const onDownloadFiltered = () => makeZipFrom(filtered);

    const onSelectAllFiltered = () => selectAll(filtered.map((f) => f.filename));
    const onShuffle = () => {
        if (!items.length) return;
        setDemo(items[Math.floor(Math.random() * items.length)]!.char);
    };

    return (
        <Box h="100vh">                                   {/* 1. full screen */}
            <Container maxW="6xl" h="100%" py={4}>          {/* 2. fill height */}
                <Flex direction="column" h="100%" minH="0" gap={3}>
                    <Flex gap={6} align="flex-start" flex="1" minH="0" flexWrap="nowrap">
                        {/* Left: fixed preview */}
                        <Box flexShrink={0}>
                            <PreviewCard
                                canvasRef={previewRef}
                                version={meta?.sequencesVersion}
                                date={meta?.sequencesDate}
                                sequencesCount={meta?.sequencesCount}
                                supplementCount={meta?.supplementCount}
                                totalCount={totalCount}
                            />
                        </Box>

                        {/* Right: toolbar (auto height) + grid (fills & scrolls) */}
                        <Flex direction="column" flex="1" minH="0" minW="0" overflow="hidden">
                            <Toolbar
                                query={query} setQuery={setQuery}
                                canvasSize={canvasSize} setCanvasSize={setCanvasSize}
                                fontSize={fontSize} setFontSize={setFontSize}
                                yOffset={yOffset} setYOffset={setYOffset}
                                glyphColor={glyphColor} setGlyphColor={setGlyphColor}
                                onShuffle={onShuffle}
                                onSelectAllFiltered={() => selectAll(filtered.map(f => f.filename))}
                                onClearSelection={clear}
                                onDownloadSelected={onDownloadSelected}
                                onDownloadFiltered={() => makeZipFrom(filtered)}
                                filteredCount={filtered.length}
                                selectedCount={selected.size}
                                busy={busy}
                            />
                            {busy && (
                                <Progress mt={3} size="sm" value={progress * 100} colorScheme="purple" />
                            )}

                            {/* This Box owns the scrolling space */}
                            <Box flex="1" minH="0" minW="0" mt={3} overflow="hidden">
                                <EmojiGrid
                                    items={filtered}
                                    selectedSet={selected}
                                    onCellClick={onCellClick}
                                    glyphColor={glyphColor}
                                    fontFamily={fontFamily}
                                />
                            </Box>
                        </Flex>
                    </Flex>

                    <canvas ref={offscreenRef} style={{ display: "none" }} />
                </Flex>
            </Container>
        </Box>
    );


}