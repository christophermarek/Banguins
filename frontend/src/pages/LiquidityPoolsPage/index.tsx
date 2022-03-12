import { useState } from "react";

interface LiquidityPoolsProps {
}


export const LiquidityPoolsPage: React.FC<LiquidityPoolsProps> = ({ }) => {

   


    const [currInput, setCurrInput] = useState<string>('');

    const [currencyStaked, setCurrencyStaked] = useState<string>('');
    const [energyStaked, setEnergyStaked] = useState<string>('');



    // unimplemented   
    // fetch exchange rate
    const calculateEnergyExchange = () => {
        return Number(currInput) * 1.15;
    }


    // unimplemented
    const exchangeCurrency = () => {
        // create transaction popup
        // send transaction
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
            <h1 className="heading">LIQUIDITY POOL</h1>
            <div id='lp'>
                <div id='left'>
                <div id='leftinner'>
                        <h2 className='title center subheading'>CRNC/ENRG DEX</h2>
                    <div id='currency_exchange'>
                        <div id="innerleft">
                        <label className="stakingLabel" htmlFor="dexChoice"><b>SWAP:</b></label>
                        <select id='dexChoice'>
                            <option value="energy">ENRG</option>
                            <option value="currency">CRNC</option>
                            </select>
                        <input type='text' value={currInput} onChange={(event) => setCurrInput(event.target.value)} />
                        </div>
                        <div id="innerright">
                        <p id="calcSwap">For {calculateEnergyExchange()} Energy</p>
                        <input type='button' className="center buttonStyle" id="exchangebutton"  value='Exchange' onClick={() => exchangeCurrency()} />
                        </div></div></div>







                    <div id='stake'>
                        <h2 className='title subheading'>STAKING</h2>
                        <div className="cstake">
                            <div className="stakingLabel">Currency</div>
                            <input type='text' value={currencyStaked} onChange={(event) => setCurrencyStaked(event.target.value)} />
                        </div>
                        <div className="estake">
                            <div className="stakingLabel">Energy</div>
                            <input type='text' value={energyStaked} onChange={(event) => setEnergyStaked(event.target.value)} />
                        </div>
                        <input id="stakebutton" className="buttonStyle" type='button' value='Stake' onClick={() => stakeCurrency()} />
                    </div>
                </div>
            <div id="right">
                <div id='staked_stats'>
                    <h2 className="subheading">Staking Stats</h2>
                    <div id="statTable"></div>
                    <div id="statChart"></div>
                    <ul>
                        {/* {placeholder_items.map((item, index) =>
                            <li key={index}>
                                {item.item_name}: {item.item_desc} Quantity: {item.quantity}
                            </li>
                        )} */}
                    </ul>
                </div>
                </div>
            </div>
        </>
    )
}