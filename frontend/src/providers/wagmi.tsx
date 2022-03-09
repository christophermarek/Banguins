import React from "react";
import { defaultChains, Provider } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const connectors = [new InjectedConnector({ chains: defaultChains })];

const WagmiProvider: React.FC = ({ children }) => {
    return (
        <Provider autoConnect connectors={connectors}>
            {children}
        </Provider>
    );
};

export default WagmiProvider;
