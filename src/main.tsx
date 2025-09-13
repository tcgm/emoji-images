import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";
import "./index.css";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";

createRoot(document.getElementById("root")!).render(
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </>
);