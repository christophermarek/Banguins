import axios, { AxiosResponse } from "axios"

import { useEffect, useState } from "react";
import { BattleView } from "./BattleView";
import { socket, socket_id } from "./socket";

let baseUrl: string
// is production
if (true) {
    baseUrl = "https://banguins.herokuapp.com"
} else {
    baseUrl = "http://localhost:8000"
}

interface LobbiesProps {
    setLobbiesSelected: any
}

export const Lobbies: React.FC<LobbiesProps> = ({ setLobbiesSelected }) => {

    async function loadDataFromServer() {
        // CHANGE THIS To 24 hours once real time stream is up
        let lobbies_fetched = (await get_lobbies());
        setLobbies(lobbies_fetched.lobbies)
    }

    useEffect(() => {

        loadDataFromServer()

        socket.on("battle", (data) => {
            console.log(data);
            if('winner' in data){
                setBattleView(false);
                setBattle(undefined)
                alert(JSON.stringify(data))
                window.location.reload();
            }else if('opponent_left' in data){
                alert('Opponent left your lobby, refreshing');
                window.location.reload();
            }else{
                setBattle(data);
                setBattleView(true);
            }

        })

    }, []);

    const [battleView, setBattleView] = useState<boolean>(false);

    const [createLobbySelected, setCreateLobbySelected] = useState<boolean>(false);
    // https://banguins.herokuapp.com/
    const [createdLobbyId, setCreatedLobbyId] = useState<any>(undefined);

    const [lobbies, setLobbies] = useState<any>([]);
    // cant define interfaces because this is just placeholder for now
    const [battle, setBattle] = useState<any>();

    interface card{
        health: number,
        attack: number,
        address: string
    }

    const placeholder_cards: card[] = []
    for(let i = 0; i < 3; i++){
        placeholder_cards[i] = {health: i, attack: 1, address: `#0xaqwqesad${i}`}
    }

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

    const join_lobby = async(lobby_id: number) => {
        if (window.confirm(`Are you sure you want to join this lobby?`)) {
            // post server
            try {
                const response: AxiosResponse<any> = await axios.post(
                    baseUrl + "/join_lobby",
                    { wallet: '0xwallet', cards: placeholder_cards, lobby_id: lobby_id , socketId: socket_id}
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
    const createLobby = async (cards_selected: card[]) => {
        setCreateLobbySelected(false);

        // post server
        try {
            const response: AxiosResponse<any> = await axios.post(
                baseUrl + "/create_lobby",
                { wallet: '0xwallet', cards: cards_selected, socketId: socket_id }
            )

            alert(`Successfully created lobby with id=${response.data.lobby_id}, now wait in lobbies until opponent joined`);
            loadDataFromServer()
        } catch (error: any) {
            alert('Error creating lobby');
        }
        // if success then alert client saying successfully created, dont leave screen until opponent joined

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
                        {createLobbySelected &&
                            <div id='createlobby'>
                                <p>Card1 selected</p>
                                <p>Card2 selected</p>
                                <p>Card3 selected</p>
                                <input type='button' value='Create Lobby' onClick={() => createLobby(placeholder_cards)} />
                            </div>
                        }
                        <input type='button' value='Go Back' onClick={() => setLobbiesSelected(false)} />

                        <h1>Lobbies</h1>

                        <input type='button' value='Create Lobby' onClick={() => setCreateLobbySelected(true)} />

                        <h1>View Lobbies</h1>
                        <div className='lobby_display'>
                            <>
                                {lobbies !== undefined && lobbies.length > 0 &&
                                    lobbies.map((lobby_info: lobbies_display) =>
                                        <div className='lobby'>
                                            <p>Opened At: {lobby_info.date_created}</p>
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