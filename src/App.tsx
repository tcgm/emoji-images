import { Box, Container, Flex, Progress } from "@chakra-ui/react";
import LibrarySelector from "./components/LibrarySelector";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEmojiData } from "./hooks/useEmojiData";
import { loadAllIcons } from "./utils/iconLibrary";
import { searchIcons } from "./utils/iconLibrary";
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
    const [yOffset, setYOffset] = useState(-4);
    const [canvasSize, setCanvasSize] = useState(64);
    const [fontSize, setFontSize] = useState(160);
    const [glyphColor, setGlyphColor] = useState("#ffffff");
    const fontFamily = "'OpenMojiBlack', 'Twemoji', 'Noto Emoji', sans-serif";

    // Filtering
    const [query, setQuery] = useState("");
    const [selectedLibrary, setSelectedLibrary] = useState("common");
    // const [libraryQuery, setLibraryQuery] = useState("");
    const filtered = useMemo(() => {
        // If a library button is pressed, search for that library
        const effectiveQuery = query;
        return effectiveQuery.trim() ? searchIcons(effectiveQuery, allIcons) : allIcons;
    }, [allIcons, query]);

    // Verify all indexes in filtered are real
    if (typeof window !== "undefined") {
        const invalidIndexes = filtered.map((it, idx) => it ? null : idx).filter(idx => idx !== null);
        if (invalidIndexes.length > 0) {
            console.warn("Invalid indexes in filtered:", invalidIndexes);
        }
    }
    // Debug: log any empty or invalid items
    if (typeof window !== "undefined") {
        const invalids = filtered.filter(it => !it || typeof it !== "object" || !it.name);
        if (invalids.length > 0) {
            console.warn("Filtered contains invalid items:", invalids);
        }
    }

    // Selection
    const { selected, toggle, rangeAdd, rememberIndex, lastIndex, clear, selectAll, setSelected } = useSelection();
    const onCellClick = (index: number, e: React.MouseEvent) => {
        const keys = filtered.map((f) => f.filename || f.name);
        const clickedKey = keys[index];
        if (e.shiftKey && lastIndex() !== null) {
            // Shift: select range
            rangeAdd(lastIndex()!, index, keys);
            rememberIndex(index);
        } else if (e.ctrlKey || e.metaKey) {
            // Ctrl/Cmd: toggle only clicked
            toggle(clickedKey);
            rememberIndex(index);
        } else {
            // Single click: select only clicked, deselect others
            setSelected(new Set([clickedKey]));
            rememberIndex(index);
        }
        // Always update preview to selected item, regardless of type
        setDemo(clickedKey);
    };

    // Preview
    const previewRef = useRef<HTMLCanvasElement | null>(null);
    const ensureFont = useEnsureFont();
    const [demo, setDemo] = useState("🤒");
    const getFontForSource = (source: string) => {
        switch (source) {
            case "twemoji":
                return "Twemoji, sans-serif";
            case "notoemoji":
                return "Noto Emoji, sans-serif";
            default:
                return "OpenMojiBlack, sans-serif";
        }
    };
    const ensureAllFonts = useCallback(async () => {
        const fonts = ["OpenMojiBlack", "Twemoji", "Noto Emoji"];
        for (const font of fonts) {
            await ensureFont(font, fontSize);
        }
    }, [fontSize, ensureFont]);
    const drawPreview = useCallback(async () => {
        if (!previewRef.current) return;
        const previewFontSize = Math.round(canvasSize * 0.8);
        const icon = allIcons.find(i => (i.filename || i.name) === demo || i.char === demo);
        if (icon) {
            const fontForIcon = getFontForSource(icon.source);
            if (icon.iconComponent) {
                await drawIconToCanvas(previewRef.current, icon.iconComponent, canvasSize, glyphColor);
            } else if (icon.char) {
                await ensureFont(fontForIcon, previewFontSize);
                drawEmojiToCanvas(
                    previewRef.current, canvasSize, icon.char, previewFontSize, yOffset, fontForIcon, glyphColor
                );
            } else if (icon.filename) {
                const ctx = previewRef.current.getContext("2d");
                if (ctx) {
                    const img = new window.Image();
                    img.onload = function () {
                        ctx.clearRect(0, 0, canvasSize, canvasSize);
                        ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
                    };
                    img.src = `/imgs/${icon.filename}`;
                }
            }
        } else {
            await ensureFont("OpenMojiBlack", previewFontSize);
            drawEmojiToCanvas(
                previewRef.current, canvasSize, demo, previewFontSize, yOffset, "OpenMojiBlack", glyphColor
            );
        }
    }, [canvasSize, demo, ensureFont, glyphColor, yOffset, allIcons]);
    useEffect(() => { void drawPreview(); }, [drawPreview]);

    // Ensure demo is always valid after filtering
    // Removed effect that clears preview on filter change. Preview only updates on selection.

    // Downloads
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState(0);
    const offscreenRef = useRef<HTMLCanvasElement | null>(null);

    const processAndDownload = useCallback(async (source: any[]) => {
        if (!offscreenRef.current) return;
        setBusy(true); setProgress(0); NProgress.start();

        await ensureFont(fontFamily, fontSize);
        const off = offscreenRef.current!;
        const blobs: Array<{ name: string; blob: Blob }> = [];

        for (let i = 0; i < source.length; i++) {
            const it = source[i];
            if (it.iconComponent) {
                await drawIconToCanvas(off, it.iconComponent, canvasSize, glyphColor);
            } else {
                await ensureFont(fontFamily, fontSize);
                drawEmojiToCanvas(off, canvasSize, it.char, fontSize, yOffset, fontFamily, glyphColor);
            }
            const blob = await new Promise<Blob>((res) => off.toBlob((b) => res(b as Blob), "image/png"));
            let fileName = it.filename || it.name;
            if (!fileName.match(/\.(png|svg)$/i)) {
                fileName += ".png";
            }
            blobs.push({ name: fileName, blob });
            setProgress(Math.min(1, (i + 1) / source.length));
            await new Promise((r) => setTimeout(r, 0));
        }

        if (blobs.length <= 10) {
            // Direct download for 10 or fewer items
            blobs.forEach(({ name, blob }) => {
                const a = document.createElement("a");
                a.download = name;
                a.href = URL.createObjectURL(blob);
                a.click();
                URL.revokeObjectURL(a.href);
            });
        } else {
            // Zip and download for more than 10 items
            const zipBlob = await zipBlobs(blobs);
            const a = document.createElement("a");
            a.download = `emojis_${meta?.sequencesVersion ?? "v"}_${meta?.sequencesDate ?? "date"}.zip`;
            a.href = URL.createObjectURL(zipBlob);
            a.click();
            URL.revokeObjectURL(a.href);
        }

        NProgress.done(); setBusy(false);
    }, [canvasSize, ensureFont, fontFamily, fontSize, glyphColor, meta, yOffset]);

    const onDownloadSelected = () => {
        if (!selected.size) return;
        const setSel = new Set(selected);
        processAndDownload(allIcons.filter((it) => setSel.has(it.filename || it.name)));
    };
    const onDownloadFiltered = () => processAndDownload(filtered);

    const onSelectAllFiltered = () => selectAll(filtered.map((f) => f.filename || f.name));
    const onShuffle = () => {
        if (!filtered.length) return;
        setDemo(filtered[Math.floor(Math.random() * filtered.length)]?.char || "");
    };

    const handleLibrarySelect = (value: string) => {
        setSelectedLibrary(value);
        if (value === "common") {
            setQuery(""); // Show all or a default common set if you want
        } else {
            setQuery(`#${value}`); // Use #source search
        }
    };

    return (
        <Box h="100vh" minH="0">
            {/*  <button style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }} onClick={() => setShowTest(v => !v)}>
                {showTest ? "Show Full App" : "Show Icon Test"}
            </button> */}
            {showTest ? (
                <ReactIconTest />
            ) : (
                <Container maxW="6xl" h="100%" minH="0" py={4}>
                    <Flex direction="column" h="100%" minH="0" gap={3}>
                        <Flex gap={6} align="flex-start" flex="1" minH="0" flexWrap="nowrap" h="100%" justifyContent="space-between">
                            <Box flexShrink={0} display="flex" flexDirection="column" gap={4} h="100%">
                                <PreviewCard
                                    canvasRef={previewRef}
                                    version={meta?.sequencesVersion}
                                    date={meta?.sequencesDate}
                                    sequencesCount={meta?.sequencesCount}
                                    supplementCount={meta?.supplementCount}
                                    totalCount={totalCount}
                                    canvasSize={canvasSize}
                                />
                                {/* Library selector as button list component */}
                                <LibrarySelector
                                    selected={query}
                                    setQuery={setQuery}
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
                                    onDownloadFiltered={() => processAndDownload(filtered)}
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