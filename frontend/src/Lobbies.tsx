import axios, { AxiosResponse } from "axios"

import { useState } from "react";
import { BattleView } from "./BattleView";

const baseUrl: string = "http://localhost:8000"

interface LobbiesProps {
    setLobbiesSelected: any
}

export const Lobbies: React.FC<LobbiesProps> = ({ setLobbiesSelected }) => {

    const [battleView, setBattleView] = useState<boolean>(false);

    const [createLobbySelected, setCreateLobbySelected] = useState<boolean>(false);


    // unimplemented
    interface lobbies_display {
        date_created: string,
        opponent_id: string,
        lobby_id: number,
    }
    const lobbies: lobbies_display[] = [];
    for (let i = 0; i < 6; i++) {
        lobbies.push({ date_created: new Date().toISOString(), opponent_id: 'null', lobby_id: 1 })
    }

    const join_lobby = (lobby_id: number) => {
        if (window.confirm(`Are you sure you want to join this lobby?`)) {
            setBattleView(true)
        }
    }

    // cards_selected is the array of card address's
    const createLobby = async (cards_selected: string[]) => {
        setCreateLobbySelected(false);

        // post server
        try {
            const response: AxiosResponse<any> = await axios.post(
                baseUrl + "/create_lobby",
                {wallet: '0xwallet', cards: cards_selected}
            )
            
            alert(`Successfully created lobby with id=${response.data.lobby_id}, now wait in lobbies until opponent joined`);
        } catch (error: any) {
            alert('Error creating lobby');
        }
        // if success then alert client saying successfully created, dont leave screen until opponent joined

    }

    return (
        <>
            {battleView ?
                (
                    <BattleView setBattleView={setBattleView} />
                )
                :
                (
                    <>
                        {createLobbySelected &&
                            <div id='createlobby'>
                                <p>Card1 selected</p>
                                <p>Card2 selected</p>
                                <p>Card3 selected</p>
                                <input type='button' value='Create Lobby' onClick={() => createLobby(
                                    ['0xasdsadsadasd', '0xasdasdasdsad', '0xzx12213213']
                                )} />
                            </div>
                        }
                        <input type='button' value='Go Back' onClick={() => setLobbiesSelected(false)} />

                        <h1>Lobbies</h1>

                        {/* unimplemented */}
                        <input type='button' value='Create Lobby' onClick={() => setCreateLobbySelected(true)} />

                        <h1>View Lobbies</h1>
                        <div className='lobby_display'>
                            <>
                                {lobbies.map((lobby_info) =>
                                    <div className='lobby'>
                                        <p>Opened At: {lobby_info.date_created}</p>
                                        <p>Oponent: {lobby_info.opponent_id}</p>
                                        <input type='button' value='Join Lobby' onClick={(() => join_lobby(lobby_info.lobby_id))} />
                                    </div>
                                )}
                            </>
                        </div>
                    </>
                )
            }
        </>
    )
}