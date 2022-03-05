import { useState } from "react";
import { Lobbies } from "./Lobbies";

interface HomeProps {

}



export const Home: React.FC<HomeProps> = ({ }) => {

    const [lobbiesSelected, setLobbiesSelected] = useState<boolean>(false);

    // implement these, props from app.ts?
    const energy = 100;
    const currency = 100;


    // unimplemented
    const Deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    //unimplemented
    const buy_deck = () => {
        console.log('beggining deck purchase');
    }

    return (
        <>
            {lobbiesSelected ?
                (
                    <Lobbies setLobbiesSelected={setLobbiesSelected} />
                )
                :
                (
                    <>
                        <p>Home Page</p>

                        <h1>Your Cards</h1>
                        <div id='allcards'>
                            {Deck.map((card, index) =>
                                <div className='card' key={index}>
                                    <p>Card number{card}</p>
                                </div>
                            )}
                        </div>

                        <div id='buydeck'>
                            <h1>Buy a deck</h1>
                            <input type='button' value='Buy' onClick={() => buy_deck()} />
                        </div>
                        {/* MOVED TO TAB INSTEAD
                        <div id='liquiditypool'>
                            <h1>Liquidity Pools</h1>
                            <input type='button' value='View Liquidity Pools' onClick={() => console.log('Clicked Liquidity Pools')} />
                        </div> */}

                        <div id='lobbies'>
                            <h1>Find A Match</h1>
                            <input type='button' value='Lobbies' onClick={() => setLobbiesSelected(true)} />
                        </div>
                    </>

                )}
        </>

    )
}