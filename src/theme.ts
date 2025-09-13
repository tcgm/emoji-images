// src/theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    // Add custom theme config here
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
    styles: {
        global: {
            "*": {
                boxSizing: "border-box",
            },
            body: {
                fontFamily: "Segoe UI Emoji, sans-serif",
                lineHeight: "base",
            },
        },
    },
});

export default theme;
