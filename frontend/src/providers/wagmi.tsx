import React from "react";
import { defaultChains, Provider } from "wagmi";
import { ethers, providers } from 'ethers'

import { InjectedConnector } from "wagmi/connectors/injected";

const connectors = [new InjectedConnector({ chains: defaultChains })];

const WagmiProvider: React.FC = ({ children }) => {
    return (
        <Provider provider={ethers.getDefaultProvider("rinkeby")} autoConnect connectors={connectors}>
            {children}
        </Provider>
    );
};

export default WagmiProvider;
