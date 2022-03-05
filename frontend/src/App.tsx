import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Home } from './Home';
import { Marketplace } from './Marketplace';
import { ethers } from 'ethers';
import { LiquidityPools } from './LiquidityPools';

function App() {

    //private key and can sign things
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>(undefined);
    // connection to the Etherum network (READ ONLY)
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);

    const [pageSelected, setPageSelected] = useState<string>('Home');

    // needs to hook to metamask
    const connect_wallet = async () => {
        // A Web3Provider wraps a standard Web3 provider, which is
        // what MetaMask injects as window.ethereum into each page
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)

        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);

        // The MetaMask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        const signer = provider.getSigner();
        setSigner(signer);
        setProvider(provider);
    }



    return (

        <div className="App">
            {provider !== undefined && signer !== undefined ?
                (
                    <>
                        <div id='navbar' >
                            <input type='button' id={pageSelected === 'Home' ? 'selected' : ''} value='Home' onClick={() => setPageSelected('Home')} />
                            <input type='button' id={pageSelected === 'Marketplace' ? 'selected' : ''} value='Marketplace' onClick={() => setPageSelected('Marketplace')} />
                            <input type='button' id={pageSelected === 'LiquidityPools' ? 'selected' : ''} value='Liquidity Pools' onClick={() => setPageSelected('LiquidityPools')} />

                        </div>
                        <>
                            {
                                pageSelected === 'Home' && <Home />
                            }
                            {
                                pageSelected === 'Marketplace' && <Marketplace />
                            }
                            {
                                pageSelected === 'LiquidityPools' && <LiquidityPools />
                            }
                        </>
                    </>
                )
                :
                (
                    <>
                        <p>Connect Your Wallet</p>
                        <input type='button' value='Connect' onClick={() => connect_wallet()} />
                    </>
                )
            }
        </div>
    );
}

export default App;
