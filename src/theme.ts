// src/theme.ts
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
    styles: {
        global: (props: any) => ({
            "*": { boxSizing: "border-box" },
            "html, body, #root": { height: "100%" },
            body: {
                fontFamily: "Segoe UI Emoji, sans-serif",
                lineHeight: "base",
                backgroundColor: mode("white", "gray.900")(props),
                color: mode("gray.800", "gray.100")(props),
            },
        }),
    },
});

const customColors = {
    white: "#ffffff",
    black: "#000000",
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff",
};

theme.colors = {
    ...theme.colors,
    custom: customColors,
};

export default theme;
