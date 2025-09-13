import {
    Box, Button, Flex, FormControl, FormLabel,
    HStack, Input, NumberInput, NumberInputField, Select, Spacer,
    useColorMode, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip
} from "@chakra-ui/react";
import { RepeatIcon, CheckIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";

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

    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Box w="100%" px={2} py={1}>
            <Flex gap={2} wrap="nowrap" align="center" w="100%">
                <Box minW="140px">
                    <FormLabel htmlFor="search" fontSize="xs" mb={0} p={0}>Search</FormLabel>
                    <Input
                        id="search"
                        placeholder="emoji or hex (e.g. 1f600)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        size="sm"
                        w="120px"
                        mr={1}
                    />
                </Box>
                <Box minW="180px">
                    <FormLabel htmlFor="emoji-size" fontSize="xs" mb={0} p={0}>Size</FormLabel>
                    <Flex align="center" gap={1}>
                        <Slider
                            id="emoji-size"
                            min={1}
                            max={1024}
                            step={1}
                            value={canvasSize}
                            onChange={setCanvasSize}
                            flex="1"
                            size="sm"
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                        <Input
                            type="number"
                            min={1}
                            max={1024}
                            value={canvasSize}
                            onChange={e => {
                                const v = Math.max(1, Math.min(1024, Number(e.target.value)));
                                setCanvasSize(v);
                            }}
                            w="40px"
                            size="sm"
                            ml={1}
                            px={1}
                        />
                    </Flex>
                </Box>
                <Box minW="80px">
                    <FormLabel htmlFor="font-size" fontSize="xs" mb={0} p={0}>Font</FormLabel>
                    <NumberInput value={fontSize} onChange={(_, v) => setFontSize(v || 160)} size="sm" w="60px" mr={1} id="font-size">
                        <NumberInputField px={1} />
                    </NumberInput>
                </Box>
                <Box minW="80px">
                    <FormLabel htmlFor="offset" fontSize="xs" mb={0} p={0}>Offset</FormLabel>
                    <NumberInput value={yOffset} onChange={(_, v) => setYOffset(v || 0)} size="sm" w="60px" mr={1} id="offset">
                        <NumberInputField px={1} />
                    </NumberInput>
                </Box>
                <Box minW="80px">
                    <FormLabel htmlFor="color" fontSize="xs" mb={0} p={0}>Color</FormLabel>
                    <Select value={glyphColor} onChange={(e) => setGlyphColor(e.target.value)} size="sm" w="60px" mr={1} px={1} id="color">
                        <option value="#ffffff">White</option>
                        <option value="#000000">Black</option>
                    </Select>
                </Box>
                <Tooltip label={colorMode === "light" ? "Switch to dark mode" : "Switch to light mode"} placement="top">
                    <Button onClick={toggleColorMode} size="sm" px={2} minW="32px">
                        {colorMode === "light" ? "🌙" : "☀️"}
                    </Button>
                </Tooltip>
                <Tooltip label="Shuffle" placement="top">
                    <Button onClick={onShuffle} isDisabled={busy} size="sm" px={2} minW="32px">
                        <RepeatIcon />
                    </Button>
                </Tooltip>
                <Tooltip label="Select All" placement="top">
                    <Button onClick={onSelectAllFiltered} isDisabled={filteredCount === 0} size="sm" px={2} minW="32px">
                        <CheckIcon />
                    </Button>
                </Tooltip>
                <Tooltip label="Clear Selection" placement="top">
                    <Button onClick={onClearSelection} isDisabled={selectedCount === 0} size="sm" px={2} minW="32px">
                        <DeleteIcon />
                    </Button>
                </Tooltip>
                <Tooltip label="Download Selected" placement="top">
                    <Button colorScheme="purple" onClick={onDownloadSelected} isDisabled={selectedCount === 0 || busy} size="sm" px={2} minW="32px">
                        <DownloadIcon />
                    </Button>
                </Tooltip>
                <Tooltip label="Download Filtered" placement="top">
                    <Button colorScheme="blue" onClick={onDownloadFiltered} isDisabled={filteredCount === 0 || busy} size="sm" px={2} minW="32px">
                        <DownloadIcon />
                    </Button>
                </Tooltip>
            </Flex>
        </Box>
    );
}
