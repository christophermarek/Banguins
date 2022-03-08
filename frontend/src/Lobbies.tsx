import axios, { AxiosResponse } from "axios"

import { useEffect, useState } from "react";
import { BattleView } from "./BattleView";
import { socket, socket_id } from "./socket";
import { card } from "./types";

let baseUrl: string
// is production
if (true) {
    baseUrl = "https://banguins.herokuapp.com"
} else {
    baseUrl = "http://localhost:8000"
}

interface LobbiesProps {
    deck: card[];
    setLobbiesSelected: any
}

export const Lobbies: React.FC<LobbiesProps> = ({ setLobbiesSelected, deck }) => {

    async function loadDataFromServer() {
        // CHANGE THIS To 24 hours once real time stream is up
        let lobbies_fetched = (await get_lobbies());
        setLobbies(lobbies_fetched.lobbies)
    }

    useEffect(() => {

        loadDataFromServer()

        socket.on("battle", (data) => {
            if ('winner' in data) {
                get_lobbies();
                setBattleView(false);
                setBattle(undefined)
                alert(JSON.stringify(data))
                window.location.reload();
            } else if ('opponent_left' in data) {
                get_lobbies();
                alert('Opponent left your lobby, refreshing');
                window.location.reload();
            } else {
                setBattle(data);
                setBattleView(true);
            }

        })

    }, []);

    const [battleView, setBattleView] = useState<boolean>(false);

    // https://banguins.herokuapp.com/
    const [createdLobbyId, setCreatedLobbyId] = useState<any>(undefined);

    const [lobbies, setLobbies] = useState<any>([]);
    // cant define interfaces because this is just placeholder for now
    const [battle, setBattle] = useState<any>();


    const [selectedCards, setSelectedCards] = useState<any>([]);



    // unimplemented
    interface lobbies_display {
        date_created: string,
        opponent_id: string,
        lobby_id: number,
    }

    // const lobbies: lobbies_display[] = [];
    // for (let i = 0; i < 6; i++) {
    //     lobbies.push({ date_created: new Date().toISOString(), opponent_id: 'null', lobby_id: 1 })
    // }

    const join_lobby = async (lobby_id: number) => {
        if (window.confirm(`Are you sure you want to join this lobby?`)) {

            if (selectedCards.length !== 3) {
                alert('Must select 3 cards');
                return;
            }

            // use addresses from cards_selected to fetch cards we pass to server
            let cards = []
            for (let i = 0; i < selectedCards.length; i++) {
                let card_found: card = deck.filter(function (sel_card: card) { return sel_card.address === selectedCards[i] })[0];
                cards.push(card_found);
            }

            // post server
            try {
                const response: AxiosResponse<any> = await axios.post(
                    baseUrl + "/join_lobby",
                    { wallet: '0xwallet', cards: cards, lobby_id: lobby_id, socketId: socket_id }
                )

                console.log(response.data);
            } catch (error: any) {
                alert('Error creating lobby');
            }

            // setBattleView(true)
        }
    }

    const get_lobbies = async () => {
        try {
            const response: AxiosResponse<any> = await axios.get(
                baseUrl + "/get_lobbies",
            )

            return response.data;

        } catch (error: any) {
            alert('Error creating lobby');
        }
    }

    // cards_selected is the array of card address's
    const createLobby = async () => {
        if (selectedCards.length !== 3) {
            console.log('error')
            alert('Only Select 3 cards');
            return;
        }

        // use addresses from cards_selected to fetch cards we pass to server
        let cards = []
        for (let i = 0; i < selectedCards.length; i++) {
            let card_found: card = deck.filter(function (sel_card: card) { return sel_card.address === selectedCards[i] })[0];
            cards.push(card_found);
        }

        // fetch cards from addresses to pass as cards_selected

        // post server
        try {
            const response: AxiosResponse<any> = await axios.post(
                baseUrl + "/create_lobby",
                { wallet: '0xwallet', cards: cards, socketId: socket_id }
            )

            alert(`Successfully created lobby with id=${response.data.lobby_id}, now wait in lobbies until opponent joined`);
            loadDataFromServer()
        } catch (error: any) {
            alert('Error creating lobby');
        }
        // if success then alert client saying successfully created, dont leave screen until opponent joined

    }

    const cardSelected = (address: string) => {

        // check if remove or add
        if (selectedCards.includes(address)) {
            // delete
            setSelectedCards(selectedCards.filter((item: any) => item !== address));
        } else {
            setSelectedCards((selectedCards: any) => [...selectedCards, address])
        }


    }

    return (
        <>
            {battleView ?
                (
                    battle !== undefined &&
                    <BattleView setBattleView={setBattleView} battle={battle} />
                )
                :
                (
                    <>
                        {/* {createLobbySelected &&
                            <div id='createlobby'>
                                <input type='button' value='Create Lobby' onClick={() => createLobby()} />
                            </div>
                        } */}
                        <input type='button' value='Go Back' onClick={() => setLobbiesSelected(false)} />

                        <h1>Lobbies</h1>
                        <p>Select 3 cards</p>
                        <div id='allcards'>
                            {deck.map((card: any, index: any) =>
                                <div className={`card ${selectedCards.includes(card.address) ? 'selected_card' : 'not'}`} key={index}>
                                    {/* <div className={`card ${card.address}`} key={index}> */}

                                    <p>Card number{card.address}</p>
                                    <input type='button' value='Select' onClick={() => cardSelected(card.address)} />
                                </div>
                            )}
                        </div>
                        <input type='button' value='Create Lobby' onClick={() => createLobby()} />

                        <h1>View Lobbies</h1>
                        <div className='lobby_display'>
                            <>
                                {lobbies !== undefined && lobbies.length > 0 &&
                                    lobbies.map((lobby_info: lobbies_display) =>
                                        <div className='lobby'>
                                            <p>Oponent: {lobby_info.opponent_id}</p>
                                            <input type='button' value='Join Lobby' onClick={(() => join_lobby(lobby_info.lobby_id))} />
                                        </div>
                                    )
                                }
                            </>
                        </div>
                    </>
                )
            }
        </>
    )
}