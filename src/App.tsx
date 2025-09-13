import { Box, Container, Flex, Progress } from "@chakra-ui/react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEmojiData } from "./hooks/useEmojiData";
import { loadAllIcons } from "./utils/iconLibrary";
import { useEnsureFont } from "./hooks/useFont";
import { useSelection } from "./hooks/useSelection";
import { drawEmojiToCanvas } from "./utils/canvas";
import { drawIconToCanvas } from "./utils/drawIconToCanvas";
import { zipBlobs } from "./utils/zip";
import type { EmojiItem } from "./utils/types";
import Toolbar from "./components/Toolbar";
import ReactIconTest from "./components/ReactIconTest";
import PreviewCard from "./components/PreviewCard";
import EmojiGrid from "./components/EmojiGrid";

export default function App() {
    const [showTest, setShowTest] = useState(false);
    // Data
    const { meta, totalCount } = useEmojiData();
    const [allIcons] = useState(() => loadAllIcons());

    // Generator settings
    const [yOffset, setYOffset] = useState(-10);
    const [canvasSize, setCanvasSize] = useState(64);
    const [fontSize, setFontSize] = useState(160);
    const [glyphColor, setGlyphColor] = useState("#ffffff");
    const fontFamily = "OpenMojiBlack";

    // Filtering
    const [query, setQuery] = useState("");
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return allIcons;
        const tokens = q.split(/\s+/g).filter(Boolean);
        return allIcons.filter((it) =>
            tokens.every((t) =>
                it.name.toLowerCase().includes(t) ||
                (it.keywords && it.keywords.some(k => k.toLowerCase().includes(t))) ||
                (it.char && it.char.toLowerCase().includes(t))
            )
        );
    }, [allIcons, query]);

    // Selection
    const { selected, toggle, rangeAdd, rememberIndex, lastIndex, clear, selectAll, setSelected } = useSelection();
    const onCellClick = (index: number, e: React.MouseEvent) => {
        const keys = filtered.map((f) => f.filename || f.name);
        const clickedKey = keys[index];
        if (e.shiftKey && lastIndex() !== null) {
            // Shift: select range
            rangeAdd(lastIndex()!, index, keys);
            rememberIndex(index);
            setDemo(filtered[index].char || ""); // Show in preview
        } else if (e.ctrlKey || e.metaKey) {
            // Ctrl/Cmd: toggle only clicked
            toggle(clickedKey);
            rememberIndex(index);
            setDemo(filtered[index].char || ""); // Show in preview
        } else {
            // Single click: select only clicked, deselect others
            setSelected(new Set([clickedKey]));
            rememberIndex(index);
            setDemo(filtered[index].char || ""); // Show in preview
        }
    };

    // Preview
    const previewRef = useRef<HTMLCanvasElement | null>(null);
    const ensureFont = useEnsureFont();
    const [demo, setDemo] = useState("🤒");
    const drawPreview = useCallback(async () => {
        if (!previewRef.current) return;
        const previewFontSize = Math.round(canvasSize * 0.8);
        // Find the demo icon in filtered
        const icon = filtered.find(i => i.char === demo || i.name === demo);
        if (icon && icon.iconComponent) {
            await drawIconToCanvas(previewRef.current, icon.iconComponent, canvasSize, glyphColor);
        } else {
            await ensureFont(fontFamily, previewFontSize);
            drawEmojiToCanvas(
                previewRef.current, canvasSize, demo, previewFontSize, yOffset, fontFamily, glyphColor
            );
        }
    }, [canvasSize, demo, ensureFont, fontFamily, glyphColor, yOffset, filtered]);
    useEffect(() => { void drawPreview(); }, [drawPreview]);

    // Downloads
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState(0);
    const offscreenRef = useRef<HTMLCanvasElement | null>(null);

    const makeZipFrom = useCallback(async (source: any[]) => {
        if (!offscreenRef.current) return;
        setBusy(true); setProgress(0); NProgress.start();

        await ensureFont(fontFamily, fontSize);
        const off = offscreenRef.current!;
        const batch = 120;
        const blobs: Array<{ name: string; blob: Blob }> = [];

        for (let i = 0; i < source.length; i += batch) {
            const part = source.slice(i, i + batch);
            await Promise.all(part.map(async (it) => {
                if (it.iconComponent) {
                    await drawIconToCanvas(off, it.iconComponent, canvasSize, glyphColor);
                } else {
                    await ensureFont(fontFamily, fontSize);
                    drawEmojiToCanvas(off, canvasSize, it.char, fontSize, yOffset, fontFamily, glyphColor);
                }
                const blob = await new Promise<Blob>((res) => off.toBlob((b) => res(b as Blob), "image/png"));
                blobs.push({ name: it.filename || it.name, blob });
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
        makeZipFrom(filtered.filter((it) => setSel.has(it.filename || it.name)));
    };
    const onDownloadFiltered = () => makeZipFrom(filtered);

    const onSelectAllFiltered = () => selectAll(filtered.map((f) => f.filename || f.name));
    const onShuffle = () => {
        if (!filtered.length) return;
        setDemo(filtered[Math.floor(Math.random() * filtered.length)]?.char || "");
    };

    return (
        <Box h="100vh" minH="0">
            <button style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }} onClick={() => setShowTest(v => !v)}>
                {showTest ? "Show Full App" : "Show Icon Test"}
            </button>
            {showTest ? (
                <ReactIconTest />
            ) : (
                <Container maxW="6xl" h="100%" minH="0" py={4}>
                    <Flex direction="column" h="100%" minH="0" gap={3}>
                        <Flex gap={6} align="flex-start" flex="1" minH="0" flexWrap="nowrap" h="100%">
                            <Box flexShrink={0}>
                                <PreviewCard
                                    canvasRef={previewRef}
                                    version={meta?.sequencesVersion}
                                    date={meta?.sequencesDate}
                                    sequencesCount={meta?.sequencesCount}
                                    supplementCount={meta?.supplementCount}
                                    totalCount={totalCount}
                                    canvasSize={canvasSize}
                                />
                            </Box>
                            <Flex direction="column" flex="1" minH="0" minW="0" h="100%">
                                <Toolbar
                                    query={query} setQuery={setQuery}
                                    canvasSize={canvasSize} setCanvasSize={setCanvasSize}
                                    fontSize={fontSize} setFontSize={setFontSize}
                                    yOffset={yOffset} setYOffset={setYOffset}
                                    glyphColor={glyphColor} setGlyphColor={setGlyphColor}
                                    onShuffle={onShuffle}
                                    onSelectAllFiltered={() => selectAll(filtered.map(f => f.filename || f.name))}
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
                                <Box flex="1" minH="0" minW="0" mt={3} h="100%">
                                    <EmojiGrid
                                        items={filtered}
                                        slice={filtered}
                                        selectedSet={selected}
                                        onCellClick={onCellClick}
                                        glyphColor={glyphColor}
                                        /* appBg="#222"
                                        appFg="#fff" */
                                        cellSize={canvasSize}
                                    />
                                </Box>
                            </Flex>
                        </Flex>
                        <canvas ref={offscreenRef} style={{ display: "none" }} />
                    </Flex>
                </Container>
            )}
        </Box>
    );


}