import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Home } from './Home';
import { Marketplace } from './Marketplace';

function App() {

    const [connected_address, setConnected_address] = useState<string | undefined>(undefined);
    const [pageSelected, setPageSelected] = useState<string>('Home');

    // needs to hook to metamask
    const connect_wallet = () => {
        setConnected_address('')
    }

    return (

        <div className="App">


            {connected_address !== undefined ?
                (
                    <>
                        <div id='navbar' >
                            <input type='button' id={pageSelected === 'Home' ? 'selected' : ''} value='Home' onClick={() => setPageSelected('Home')} />
                            <input type='button' id={pageSelected === 'Marketplace' ? 'selected' : ''} value='Marketplace' onClick={() => setPageSelected('Marketplace')} />
                        </div>
                        <>
                            {
                                pageSelected === 'Home' && <Home />
                            }
                            {
                                pageSelected === 'Marketplace' && <Marketplace />
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
