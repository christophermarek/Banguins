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
import { useAccount } from "wagmi";

function App() {

    document.title = 'Banguins'

    const [{ data: accountData }, disconnect] = useAccount({
        fetchEns: true,
    })

    return (
        <Box >
            <SnowfallEffect />

            <Header />

            {accountData ?
                (<Container maxWidth="container.xl" pt={10} pb={20}>
                    <Routes>
                        <Route index element={<HomePage />} />
                        <Route path="marketplace" element={<MarketplacePage />} />
                        <Route path="liquidity-pools" element={<LiquidityPoolsPage />} />
                        <Route path="lobbies" element={<LobbiesPage />} />
                        <Route path="battle/:lobbyId/:selected_cards" element={<BattlePage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>

                </Container>)
                :
                (
                    <p id='error'>Connect your wallet to access the site</p>
                )
            }


        </Box>
    );
}

export default App;
