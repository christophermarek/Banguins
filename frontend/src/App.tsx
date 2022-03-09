import React, { useState } from "react";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { ethers } from "ethers";
import { LiquidityPoolsPage } from "./pages/LiquidityPoolsPage";
import { card } from "./types";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { Box, Container } from "@chakra-ui/react";
import { LobbiesPage } from "./pages/LobbiesPage";

function App() {
    return (
        <Box backgroundColor="whiteHeat.50">
            <Header />
            <Container maxWidth="container.xl" pt={10} pb={20}>
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="marketplace" element={<MarketplacePage />} />
                    <Route path="liquidity-pools" element={<LiquidityPoolsPage />} />
                    <Route path="lobbies" element={<LobbiesPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Container>
        </Box>
    );
}

export default App;
