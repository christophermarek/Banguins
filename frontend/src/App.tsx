import React from "react";
import "./App.scss";
import { HomePage } from "./pages/HomePage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { LiquidityPoolsPage } from "./pages/LiquidityPoolsPage";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { Box, Container } from "@chakra-ui/react";
import { LobbiesPage } from "./pages/LobbiesPage";
import BattlePage from "./pages/BattlePage";
import SnowfallEffect from "./components/SnowFallEffect";

function App() {
    return (
        <Box >
            <SnowfallEffect />
            
            <Header />
            <Container maxWidth="container.xl" pt={10} pb={20}>
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="marketplace" element={<MarketplacePage />} />
                    <Route path="liquidity-pools" element={<LiquidityPoolsPage />} />
                    <Route path="lobbies" element={<LobbiesPage />} />
                    <Route path="battle/:lobbyId" element={<BattlePage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>

            </Container>
        </Box>
    );
}

export default App;
