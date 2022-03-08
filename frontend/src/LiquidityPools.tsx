import { useState } from "react";

interface LiquidityPoolsProps {
}


export const LiquidityPools: React.FC<LiquidityPoolsProps> = ({ }) => {

   


    const [currInput, setCurrInput] = useState<string>('');
    const [tokeInput, setTokeInput] = useState<string>('');

    const [currencyStaked, setCurrencyStaked] = useState<string>('');
    const [energyStaked, setEnergyStaked] = useState<string>('');



    // unimplemented   
    // fetch exchange rate
    const exchangeValue = () => {
        return Number(currInput) * 2.15;
    }
    const setCurrency = () => {
        return tokeInput;

    }

    // unimplemented
    const exchangeCurrency = () => {
        // create transaction popup
        // send transaction
        return(tokeInput)
        alert('currency transfer complete, please wait for wallet balance to update');
    }

    // unimplemented
    const stakeCurrency = () => {
        // create transaction popup
        // send transaction
        alert('currency staked')
    }

    return (
        <>
            <h1>Liquidity Pools</h1>

            <div id='lp'>

                <div id='left'>
<<<<<<< Updated upstream

                    <div id='currency_exchange'>
                        <p>Exchange currency for energy</p>
                        <p>Currency</p>
                        <input type='text' value={currInput} onChange={(event) => setCurrInput(event.target.value)} />
                        <p>For {calculateEnergyExchange()} Energy</p>

                        <input type='button' value='Exchange' onClick={() => exchangeCurrency()} />
                    </div>

                    <div id='stake'>
                        <div>
                            <p>Currency</p>
                            <input type='text' value={currencyStaked} onChange={(event) => setCurrencyStaked(event.target.value)} />
                        </div>
                        <div>
                            <p>Energy</p>
                            <input type='text' value={energyStaked} onChange={(event) => setEnergyStaked(event.target.value)} />
                        </div>
                        <input type='button' value='Stake' onClick={() => stakeCurrency()} />
=======
                    <div id='leftinner'>
                        <h1 className='title center'>SWAP</h1>
                        <div id='currency_exchange'>
                            <div className="flex row innerleft">
                            <input id="swapInput" className="txtInput" type='text' value={currInput} onChange={(event) => setCurrInput(event.target.value)} />
                            <select value={tokeInput} onChange={(event) => setTokeInput(event.target.value)} id='dexChoice'>
                                <option value="currency">ENRG</option>
                                <option value="energy">CRNC</option>
                            </select>
                            </div>
                            <div className="innerright">
                                <div id="swapVal"><h1>{exchangeValue()}</h1><h3>{setCurrency()}</h3>
                                </div>
                                <input type='button' className="center" id="swapButton"  value='Exchange' onClick={() => exchangeCurrency()} />
                            </div>
                        
                        </div>
                    </div>
                    <div id='stake'>
                        <h1 className='title center'>STAKE</h1>
                        <div className="flex row">
                        <div className="innerleft">
                            <div className="cstake cenrig">
                                <input className="txtInput" type='text' value={currencyStaked} onChange={(event) => setCurrencyStaked(event.target.value)} />
                                <div>Currency</div>
                            </div>
                            <div className="estake cenrig">
                                <input type='text' className="txtInput" value={energyStaked} onChange={(event) => setEnergyStaked(event.target.value)} />
                                <div>Energy</div>
                            </div>
                        </div>
                    <div className="innerright">
                        <div className="swapVal"><h1>{exchangeValue()}</h1><h3>{setCurrency()}</h3></div>
                        <input id="stakebutton" className="center" type='button' value='Stake' onClick={() => stakeCurrency()} />
>>>>>>> Stashed changes
                    </div>
                    </div>
                    </div>
                </div>

                <div id='staked_stats'>
                    <h1>Staking Stats</h1>
                    <ul>
                        {/* {placeholder_items.map((item, index) =>
                            <li key={index}>
                                {item.item_name}: {item.item_desc} Quantity: {item.quantity}
                            </li>
                        )} */}
                    </ul>
                </div>

            </div>
        </>
    )
}