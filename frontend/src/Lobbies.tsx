import { useState } from "react";
import { BattleView } from "./BattleView";

interface LobbiesProps {
    setLobbiesSelected: any
}


export const Lobbies: React.FC<LobbiesProps> = ({ setLobbiesSelected }) => {

    const [battleView, setBattleView] = useState<boolean>(false);

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

    return (
        <>
            {battleView ?
                (
                    <BattleView setBattleView={setBattleView}/>
                )
                :
                (
                    <>
                        <input type='button' value='Go Back' onClick={() => setLobbiesSelected(false)} />

                        <h1>Lobbies</h1>

                        {/* unimplemented */}
                        <input type='button' value='Create Lobby' onClick={() => console.log('createLobby')} />

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