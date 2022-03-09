import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme";
import WagmiProvider from "./providers/wagmi";

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <WagmiProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </WagmiProvider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
