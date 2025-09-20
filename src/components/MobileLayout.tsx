import React, { memo } from "react";
import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Progress, Text, useDisclosure } from "@chakra-ui/react";
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
}

const MobileLayout: React.FC<Props> = memo((props) => {
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
        onCellClick
    } = props;

    const {
        isOpen: isToolbarOpen,
        onOpen: onToolbarOpen,
        onClose: onToolbarClose
    } = useDisclosure();

    const {
        isOpen: isLibraryOpen,
        onOpen: onLibraryOpen,
        onClose: onLibraryClose
    } = useDisclosure();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            width="100vw"
            bg="gray.100"
            p={4}
        >
            <Text fontSize="lg" fontWeight="bold">
                Mobile Layout
            </Text>
            <Box mt={4} display="flex" flexDirection="column" gap={4} width="100%">
                <Button onClick={onLibraryOpen} colorScheme="purple" size="sm">
                    Open Library Selector
                </Button>
                <Button onClick={onToolbarOpen} colorScheme="purple" size="sm">
                    Open Toolbar
                </Button>
                <Drawer isOpen={isLibraryOpen} placement="left" onClose={onLibraryClose} size="xs">
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Library Selector</DrawerHeader>
                        <DrawerBody>
                            <LibrarySelector
                                selected={query}
                                setQuery={setQuery}
                                isMobile={true}
                            />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
                <Drawer isOpen={isToolbarOpen} placement="right" onClose={onToolbarClose} size="xs">
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Toolbar</DrawerHeader>
                        <DrawerBody>
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
                                isMobile={true}
                            />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
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
                        isMobile={true}
                    />
                </Box>
            </Box>
        </Box>
    );
});

export default MobileLayout;