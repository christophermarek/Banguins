import React, { useState } from "react";
import "./App.css";
import { Home } from "./pages/Home";
import { Marketplace } from "./pages/Marketplace";
import { ethers } from "ethers";
import { LiquidityPools } from "./pages/LiquidityPools";
import { card } from "./types";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { Box, Container } from "@chakra-ui/react";

function App() {
    //private key and can sign things
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>(undefined);
    // connection to the Etherum network (READ ONLY)
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);

    const [pageSelected, setPageSelected] = useState<string>("Home");

    // unimplemented
    let placeholder_cards: card[] = [];
    for (let i = 0; i < 3; i++) {
        placeholder_cards[i] = { health: i + 1, attack: i + 1, address: `#0xaqwqesad${i}` };
    }

    // needs to hook to metamask
    const connect_wallet = async () => {
        // A Web3Provider wraps a standard Web3 provider, which is
        // what MetaMask injects as window.ethereum into each page
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);

        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);

        // The MetaMask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        const signer = provider.getSigner();
        setSigner(signer);
        setProvider(provider);
    };

    return (
        <Box backgroundColor="whiteHeat.50">
            <Header />
            <Container maxWidth="container.xl" padding={0}>
                <Routes>
                    <Route index element={<Home deck={placeholder_cards} />} />
                    <Route path="marketplace" element={<Marketplace />} />
                    <Route path="liquidity-pools" element={<LiquidityPools />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Container>
        </Box>
    );
}

export default App;
