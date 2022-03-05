import { useState } from "react";

interface BattleViewProps {
    setBattleView: any
}


export const BattleView: React.FC<BattleViewProps> = ({ setBattleView }) => {

    const leaveBattle = () => {
        if(window.confirm('Are you sure you want to leave the battle, you will lose your stake')){
            setBattleView(false);
        }
    }

    return (
        <>
            <input type='button' value='Leave Battle' onClick={() => leaveBattle()} />
            <h1>Battle</h1>
        </>

    )
}