import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Home } from './Home';

function App() {

    const [connected_address, setConnected_address] = useState<string | undefined>(undefined);

    const connect_wallet = () =>{
        setConnected_address('')
    }

    return (
        <div className="App">
            {connected_address !== undefined ?
                (
                    <Home />
                )
                :
                (
                    <>
                        <p>Connect Your Wallet</p>
                        <input type='button' value='Connect' onClick={() => connect_wallet()}/>
                    </>
                )
            }
        </div>
    );
}

export default App;
