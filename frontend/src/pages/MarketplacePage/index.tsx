import { useState } from "react";

interface MarketPlaceProps {

}



export const MarketplacePage: React.FC<MarketPlaceProps> = ({ }) => {

    interface store_item {
        img_src: string,
        quantity: number,
        item_name: string,
        item_desc: string
    }

    const placeholder_items: store_item[] = [
        { img_src: '/src/img/store-fish.png', quantity: 20, item_name: 'Fish', item_desc: 'Distract the opponent for a turn with a succulent fish' },
        { img_src: '/src/img/store-flippers.png', quantity: 20, item_name: 'Frozen Flippers', item_desc: 'Active Penguin Deals 10% more damage for the remainder of the battle ' },
        { img_src: '/src/img/store-coin.png', quantity: 20, item_name: 'Double Coin', item_desc: 'Use on your first turn to earn double reward if you win, but losing gets you nothing.' },
        { img_src: '/src/img/store-potion.png', quantity: 20, item_name: 'Potion', item_desc: 'Restores the health of a penguin on your team' }
    ]


    const [currInput, setCurrInput] = useState<string>('');

    const [currencyStaked, setCurrencyStaked] = useState<string>('');
    const [energyStaked, setEnergyStaked] = useState<string>('');



    // unimplemented   
    // fetch exchange rate
    const calculateNumberPacksCost = () => {
        return Number(currInput) * 3;
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



    // unimplemented   
    // fetch exchange rate
    const calculateEnergyExchange = () => {
        return Number(currInput) * 1.15;
    }
    
    

    return (
        <>
            <h1 className="heading">Marketplace</h1>

            <div id='mp'>

                <div id='left'>

                    <div id='mint_pack'>
                        <h2 className="subheading">Mint a Pack for 3 MATIC</h2>
                        <p>Limit 3 packs per week.</p>
                        {/* <input type='text' value={currInput} onChange={(event) => setMintPackNum(event.target.value)} /> */}
                        <p>For {calculateNumberPacksCost()} MATIC</p>//

                        {/* <input type='button' className="buttonStyle" value='Mint Pack' onClick={() => mintPack()} /> */}
                    </div>

                    <div id='stake'>
                        <div>
                            <p className="stakingLabel">Currency</p>
                            <input type='text' value={currencyStaked} onChange={(event) => setCurrencyStaked(event.target.value)} />
                        </div>
                        <div>
                            <p className="stakingLabel">Energy</p>
                            <input type='text' value={energyStaked} onChange={(event) => setEnergyStaked(event.target.value)} />
                        </div>
                        <input type='button' className="buttonStyle" value='Stake' onClick={() => stakeCurrency()} />
                    </div>
                </div>
                <div id='right'>
                <div id='general_store'>
                    <h1 className="subheading">General Store</h1>
                    <ul className="itemList">
                        {placeholder_items.map((item, index) =>
                            <li key={index}>
                                <span className="stakingLabel">{item.item_name} Quantity: {item.quantity}</span><p>{item.item_desc}</p>
                            </li>
                        )}
                    </ul>
                    <div id='buyItems'>
                        <p className="stakingLabel">Cost {calculateNumberPacksCost()} MATIC</p>
                        <input id="storebutton" className="buttonStyle" type='button' value='Buy' onClick={() => stakeCurrency()} />
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}