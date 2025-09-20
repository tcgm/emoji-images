import React, { memo } from "react";
import { Box, Flex, Progress } from "@chakra-ui/react";
import PreviewCard from "./PreviewCard";
import LibrarySelector from "./LibrarySelector";
import Toolbar from "./Toolbar";
import EmojiGrid from "./EmojiGrid";

interface Props {
    query: string;
    setQuery: (value: string) => void;
    canvasSize: number;
    setCanvasSize: (value: number) => void;
    fontSize: number;
    setFontSize: (value: number) => void;
    yOffset: number;
    setYOffset: (value: number) => void;
    glyphColor: string;
    setGlyphColor: (value: string) => void;
    onShuffle: () => void;
    selectAll: (items: string[]) => void;
    filtered: any[];
    clear: () => void;
    onDownloadSelected: () => void;
    processAndDownload: (items: any[]) => void;
    busy: boolean;
    progress: number;
    selected: Set<string>;
    onCellClick: (index: number, event: React.MouseEvent) => void;
    previewRef: React.RefObject<HTMLCanvasElement>;
    meta: any;
    totalCount: number;
    offscreenRef: React.RefObject<HTMLCanvasElement>;
}

const DesktopLayout: React.FC<Props> = memo((props) => {
    const {
        query,
        setQuery,
        canvasSize,
        setCanvasSize,
        fontSize,
        setFontSize,
        yOffset,
        setYOffset,
        glyphColor,
        setGlyphColor,
        onShuffle,
        selectAll,
        filtered,
        clear,
        onDownloadSelected,
        processAndDownload,
        busy,
        progress,
        selected,
        onCellClick,
        previewRef,
        meta,
        totalCount,
        offscreenRef
    } = props;

    return (
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
                            cellSize={canvasSize}
                        />
                    </Box>
                </Flex>
            </Flex>
            <canvas ref={offscreenRef} style={{ display: "none" }} />
        </Flex>
    );
});

export default DesktopLayout;