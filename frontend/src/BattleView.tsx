import { useEffect, useState } from "react";
import { socket, socket_id } from "./socket";

interface BattleViewProps {
    setBattleView: any
    battle: any
}


export const BattleView: React.FC<BattleViewProps> = ({ setBattleView, battle }) => {

    const [target, setTarget] = useState<string>('');
    const [you, setYou] = useState<any>(undefined);
    const [opponent, setOpponent] = useState<any>(undefined);

    useEffect(() => {

        let you_n;
        let opponent_n;
        if (socket_id === battle.player1_conn) {
            you_n = { addr: battle.player1_addr, cards: battle.player1_cards };
            opponent_n = { addr: battle.player2_addr, cards: battle.player2_cards };
            setYou(you_n);
            setOpponent(opponent_n);
        } else {
            you_n = { addr: battle.player2_addr, cards: battle.player2_cards };
            opponent_n = { addr: battle.player1_addr, cards: battle.player1_cards };
            setYou(you_n);
            setOpponent(opponent_n);
        }


    }, []);

    const leaveBattle = () => {
        if (window.confirm('Are you sure you want to leave the battle, you will lose your stake')) {
            setBattleView(false);
        }
    }

    const sendMove = (card: any) => {
        if (target !== '') {
            socket.emit('battle', { move: card, target: target });
        } else {
            alert('must select a target for move')
        }
    }

    return (
        <>
            <input type='button' value='Leave Battle' onClick={() => leaveBattle()} />
            <h1>Battle {you?.addr} VS {opponent?.addr}</h1>
            <div id='opponent'>
                {opponent !== undefined && opponent.cards.map((card: any) =>
                    <div>
                        <p>{card.address}</p>
                        <p>Health: {card.health}</p>
                        <p>Attack :{card.attack}</p>
                        <input type='button' value='Select Target' onClick={() => setTarget(card.address)} />
                    </div>
                )}
            </div>
            <div id='you'>
                {you !== undefined && you.cards.map((card: any) =>
                    <div>
                        <p>{card.address}</p>
                        <p>Health: {card.address}</p>
                        <p>Attack :{card.address}</p>
                        <input type='button' value='Attack with card' onClick={() => sendMove(card)} />
                    </div>
                )}
            </div>

        </>

    )
}