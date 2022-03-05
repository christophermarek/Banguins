import { useState } from "react";

interface LiquidityPoolsProps {
}


export const LiquidityPools: React.FC<LiquidityPoolsProps> = ({ }) => {

    interface store_item {
        img_src: string,
        quantity: number,
        item_name: string,
        item_desc: string
    }

    const placeholder_items: store_item[] = [
        { img_src: 'n/a', quantity: 20, item_name: 'Fish', item_desc: 'Heals the users active penguin for 40% of their health' },
        { img_src: 'n/a', quantity: 20, item_name: 'Frozen Fins', item_desc: 'Active Penguin Deals 10% more damage for the remainder of the battle ' },
        { img_src: 'n/a', quantity: 20, item_name: 'item name', item_desc: 'This is an item description where the item is described' },
        { img_src: 'n/a', quantity: 20, item_name: 'item name', item_desc: 'This is an item description where the item is described' }
    ]


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

                <div id='general_store'>
                    <h1>General Store</h1>
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