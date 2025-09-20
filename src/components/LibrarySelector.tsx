import { Box, IconButton, SimpleGrid, Tooltip, Icon } from "@chakra-ui/react";
import { LIBRARIES } from "../libraries";

export type LibrarySelectorProps = {
    selected: string;
    setQuery: (query: string) => void; // Updated to use setQuery from Toolbar
    isMobile?: boolean;
};

export default function LibrarySelector({ selected, setQuery, isMobile = false }: LibrarySelectorProps) {
    return (
        <Box overflowY="auto" border="1px solid #ccc" borderRadius="md" p={isMobile ? 1 : 2}>
            <SimpleGrid columns={isMobile ? [2] : [3]} spacing={1}>
                {LIBRARIES.map(lib => (
                    <Tooltip key={lib.value} label={lib.label} placement="top">
                        <IconButton
                            aria-label={lib.label}
                            icon={
                                lib.icon ? (
                                    <Icon as={lib.icon} boxSize={isMobile ? 4 : 6} /> // Ensure proper sizing for Chakra UI icons
                                ) : (
                                    <Box textAlign="center">
                                        <Box fontSize={isMobile ? "md" : "lg"} fontWeight="bold">
                                            {lib.majorText}
                                        </Box>
                                        <Box fontSize={isMobile ? "xs" : "sm"}>
                                            {lib.minorText}
                                        </Box>
                                    </Box>
                                )
                            }
                            variant={selected === lib.value ? "solid" : "outline"} // Compare directly with the search field value
                            colorScheme={selected === lib.value ? "purple" : "gray"} // Reflect the search field state
                            onClick={() => setQuery(`${lib.isCategory ? '#' : ''}${lib.value}`)} // Prepend hashtag to the library value
                            size={isMobile ? "sm" : "lg"}
                        />
                    </Tooltip>
                ))}
            </SimpleGrid>
        </Box>
    );
}
