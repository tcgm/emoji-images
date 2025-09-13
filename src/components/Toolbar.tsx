import {
    Box, Button, Flex, FormControl, FormLabel,
    HStack, Input, NumberInput, NumberInputField, Select, Spacer
} from "@chakra-ui/react";

type Props = {
    query: string; setQuery: (s: string) => void;
    canvasSize: number; setCanvasSize: (n: number) => void;
    fontSize: number; setFontSize: (n: number) => void;
    yOffset: number; setYOffset: (n: number) => void;
    glyphColor: string; setGlyphColor: (v: string) => void;
    onShuffle: () => void;
    onSelectAllFiltered: () => void;
    onClearSelection: () => void;
    onDownloadSelected: () => void;
    onDownloadFiltered: () => void;
    filteredCount: number;
    selectedCount: number;
    busy: boolean;
};

export default function Toolbar(props: Props) {
    const {
        query, setQuery,
        canvasSize, setCanvasSize,
        fontSize, setFontSize,
        yOffset, setYOffset,
        glyphColor, setGlyphColor,
        onShuffle, onSelectAllFiltered, onClearSelection,
        onDownloadSelected, onDownloadFiltered,
        filteredCount, selectedCount, busy
    } = props;

    return (
        <Box>
            <Flex gap={3} wrap="wrap" align="end">
                <FormControl maxW="sm">
                    <FormLabel>Search</FormLabel>
                    <Input
                        placeholder="emoji or hex (e.g. 1f600)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </FormControl>

                <HStack spacing={3}>
                    <FormControl w="120px">
                        <FormLabel size="sm">Size</FormLabel>
                        <NumberInput value={canvasSize} onChange={(_, v) => setCanvasSize(v || 200)}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>

                    <FormControl w="120px">
                        <FormLabel size="sm">Font</FormLabel>
                        <NumberInput value={fontSize} onChange={(_, v) => setFontSize(v || 160)}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>

                    <FormControl w="120px">
                        <FormLabel size="sm">Offset</FormLabel>
                        <NumberInput value={yOffset} onChange={(_, v) => setYOffset(v || 0)}>
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>

                    <FormControl w="140px">
                        <FormLabel size="sm">Color</FormLabel>
                        <Select value={glyphColor} onChange={(e) => setGlyphColor(e.target.value)}>
                            <option value="#ffffff">White</option>
                            <option value="#000000">Black</option>
                        </Select>
                    </FormControl>
                </HStack>

                <Spacer />

                <HStack>
                    <Button onClick={onShuffle} isDisabled={busy}>Shuffle</Button>
                    <Button onClick={onSelectAllFiltered} isDisabled={filteredCount === 0}>Select All ({filteredCount})</Button>
                    <Button onClick={onClearSelection} isDisabled={selectedCount === 0}>Clear</Button>
                    <Button colorScheme="purple" onClick={onDownloadSelected} isDisabled={selectedCount === 0 || busy}>
                        Download Selected ({selectedCount})
                    </Button>
                    <Button colorScheme="blue" onClick={onDownloadFiltered} isDisabled={filteredCount === 0 || busy}>
                        Download Filtered ({filteredCount})
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
}
