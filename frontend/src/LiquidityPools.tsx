import { useState } from "react";

interface LiquidityPoolsProps {
}


export const LiquidityPools: React.FC<LiquidityPoolsProps> = ({ }) => {

   


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
            <h1>Liquidity Pools</h1>

            <div id='lp'>

                <div id='left'>

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
                    </div>
                </div>

                <div id='staked_stats'>
                    <h1>Staking Stats</h1>
                    <ul>
                        {placeholder_items.map((item, index) =>
                            <li key={index}>
                                {item.item_name}: {item.item_desc} Quantity: {item.quantity}
                            </li>
                        )}
                    </ul>
                </div>

            </div>
        </>
    )
}