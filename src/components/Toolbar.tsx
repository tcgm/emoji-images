import {
    Box, Button, Flex, FormControl, FormLabel,
    HStack, Input, NumberInput, NumberInputField, Select, Spacer,
    useColorMode, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip
} from "@chakra-ui/react";
import { RepeatIcon, CheckIcon, DeleteIcon, DownloadIcon, QuestionIcon } from "@chakra-ui/icons";

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
        <Box w="100%" px={2} py={1} className="toolbar-container" id="toolbar-container">
            <Flex gap={2} wrap="nowrap" align="center" w="100%" className="toolbar-flex" id="toolbar-flex">
                <Box minW="256px" className="toolbar-search" id="toolbar-search">
                    <FormLabel htmlFor="search" fontSize="xs" mb={0} p={0} className="toolbar-label" id="toolbar-label-search">Search</FormLabel>
                    <Flex align="center">
                        <Input
                            id="search"
                            className="toolbar-input-search"
                            placeholder="emoji or hex (e.g. 1f600)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            size="sm"
                            w="256px"
                            mr={1}
                        />
                        <Tooltip
                            label={
                                <>
                                    Search Guide:<br />
                                    - Use keywords (e.g., smile)<br />
                                    - Use hex codes (e.g., 1f600)<br />
                                    - Use ranges (e.g., 1f600..1f64f)<br />
                                    - Use #source to filter by library
                                </>
                            }
                            aria-label="Search Guide Tooltip"
                        >
                            <QuestionIcon cursor="pointer" />
                        </Tooltip>
                    </Flex>
                </Box>
                <Box minW="180px" className="toolbar-size" id="toolbar-size">
                    <FormLabel htmlFor="emoji-size" fontSize="xs" mb={0} p={0} className="toolbar-label" id="toolbar-label-size">Size</FormLabel>
                    <Flex align="center" gap={1} className="toolbar-size-flex" id="toolbar-size-flex">
                        <Slider
                            id="emoji-size"
                            className="toolbar-slider-size"
                            min={32}
                            max={256}
                            step={8}
                            value={canvasSize}
                            onChange={setCanvasSize}
                            flex="1"
                            size="sm"
                        >
                            <SliderTrack className="toolbar-slidertrack-size" id="toolbar-slidertrack-size">
                                <SliderFilledTrack className="toolbar-sliderfilledtrack-size" id="toolbar-sliderfilledtrack-size" />
                            </SliderTrack>
                            <SliderThumb className="toolbar-sliderthumb-size" id="toolbar-sliderthumb-size" />
                        </Slider>
                        <Input
                            type="number"
                            min={32}
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
                            className="toolbar-input-size"
                            id="toolbar-input-size"
                        />
                    </Flex>
                </Box>
                <Box minW="80px" className="toolbar-font" id="toolbar-font">
                    <FormLabel htmlFor="font-size" fontSize="xs" mb={0} p={0} className="toolbar-label" id="toolbar-label-font">Font</FormLabel>
                    <NumberInput value={fontSize} onChange={(_, v) => setFontSize(v || 160)} size="sm" w="60px" mr={1} id="font-size" className="toolbar-numberinput-font">
                        <NumberInputField px={1} className="toolbar-numberinputfield-font" id="toolbar-numberinputfield-font" />
                    </NumberInput>
                </Box>
                <Box minW="80px" className="toolbar-offset" id="toolbar-offset">
                    <FormLabel htmlFor="offset" fontSize="xs" mb={0} p={0} className="toolbar-label" id="toolbar-label-offset">Offset</FormLabel>
                    <NumberInput value={yOffset} onChange={(_, v) => setYOffset(v || 0)} size="sm" w="60px" mr={1} id="offset" className="toolbar-numberinput-offset">
                        <NumberInputField px={1} className="toolbar-numberinputfield-offset" id="toolbar-numberinputfield-offset" />
                    </NumberInput>
                </Box>
                <Box minW="160px" className="toolbar-color" id="toolbar-color">
                    <FormLabel htmlFor="color" fontSize="xs" mb={0} p={0} className="toolbar-label" id="toolbar-label-color">Color</FormLabel>
                    <Flex align="center" gap={1}>
                        <Select
                            value={glyphColor}
                            onChange={(e) => setGlyphColor(e.target.value)}
                            size="sm"
                            w="100%"
                            mr={1}
                            px={1}
                            id="color"
                            className="toolbar-select-color"
                        >
                            <option value="theme.colors.custom.white">White</option>
                            <option value="theme.colors.custom.black">Black</option>
                            <option value="theme.colors.custom.red">Red</option>
                            <option value="theme.colors.custom.green">Green</option>
                            <option value="theme.colors.custom.blue">Blue</option>
                        </Select>
                        <Input
                            type="color"
                            value={glyphColor}
                            onChange={e => setGlyphColor(e.target.value)}
                            w="32px"
                            h="32px"
                            p={0}
                            border="none"
                            bg="none"
                            minW="32px"
                            className="toolbar-input-color"
                            id="toolbar-input-color"
                        />
                    </Flex>
                </Box>
                <Tooltip label={colorMode === "light" ? "Switch to dark mode" : "Switch to light mode"} placement="top">
                    <Button onClick={toggleColorMode} size="sm" px={2} minW="32px" className="toolbar-btn-togglecolor" id="toolbar-btn-togglecolor">
                        {colorMode === "light" ? "🌙" : "☀️"}
                    </Button>
                </Tooltip>
                <Tooltip label="Shuffle" placement="top">
                    <Button onClick={onShuffle} isDisabled={busy} size="sm" px={2} minW="32px" className="toolbar-btn-shuffle" id="toolbar-btn-shuffle">
                        <RepeatIcon />
                    </Button>
                </Tooltip>
                <Tooltip label="Select All" placement="top">
                    <Button onClick={onSelectAllFiltered} isDisabled={filteredCount === 0} size="sm" px={2} minW="32px" className="toolbar-btn-selectall" id="toolbar-btn-selectall">
                        <CheckIcon />
                    </Button>
                </Tooltip>
                <Tooltip label="Clear Selection" placement="top">
                    <Button onClick={onClearSelection} isDisabled={selectedCount === 0} size="sm" px={2} minW="32px" className="toolbar-btn-clearselection" id="toolbar-btn-clearselection">
                        <DeleteIcon />
                    </Button>
                </Tooltip>
                <Tooltip label="Download Selected" placement="top">
                    <Button colorScheme="purple" onClick={onDownloadSelected} isDisabled={selectedCount === 0 || busy} size="sm" px={2} minW="32px" className="toolbar-btn-downloadselected" id="toolbar-btn-downloadselected">
                        <DownloadIcon />
                    </Button>
                </Tooltip>
                <Tooltip label="Download Filtered" placement="top">
                    <Button colorScheme="blue" onClick={onDownloadFiltered} isDisabled={filteredCount === 0 || busy} size="sm" px={2} minW="32px" className="toolbar-btn-downloadfiltered" id="toolbar-btn-downloadfiltered">
                        <DownloadIcon />
                    </Button>
                </Tooltip>
            </Flex>
        </Box>
    );
}
