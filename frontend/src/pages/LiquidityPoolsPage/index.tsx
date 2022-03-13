import { useState } from "react";

interface LiquidityPoolsProps {
}


export const LiquidityPoolsPage: React.FC<LiquidityPoolsProps> = ({ }) => {

   


    const [currInput, setCurrInput] = useState<string>('');
    const [currencyStaked, setCurrencyStaked] = useState<string>('');
    const [energyStaked, setEnergyStaked] = useState<string>('');



    // unimplemented   
    // fetch exchange rate
    const calculateExchangeRate = () => {
        return Number(currInput) * 1.15;

        //  function CalculateRewardRate(uint _currency, uint _energy) public view returns (uint rewardRate6)
    }


    // unimplemented
    const exchangeCurrency = () => {
        // create transaction popup
        // send transaction

        //  function swapCurrency(uint _id, uint _amount) external {
        
        alert('Tokens Swapped');
    }

    // unimplemented
    const stakeCurrency = () => {
        // create transaction popup
        // send transaction

//     function StakeTokens(uint _currency, uint _energy) public returns (string memory) {

        alert('Stake Deposited')
    }

    const unstakeCurrency = () => {
        // create transaction popup
        // send transaction
        //    function UnstakeTokens(uint _currency, uint _energy) public  {

        alert('Stake Withdrawn')
    }
    const claimRewards = () => {
        // create transaction popup
        // send transaction
        alert('Rewards Claimed')
    }

    const calculateRewards = () => {
        //    function CalculateRewardAmount(uint rewardRate, uint _lastClaim) public view returns (uint rewardAmount) {

        return Number(currInput) * 1.15;
    }

    return (
        <>
            <h1 className="heading">LIQUIDITY POOL</h1>
            <div id='lp'>
                <div id='left'>
                <div id='leftinner'>
                        <h2 className='title center subheading'>CRNC/ENRG DEX</h2>
                    <div id='currency_exchange'>
                        <div id="innerleft">
                        <label className="stakingLabel" htmlFor="dexChoice"><b>SWAP:</b></label>
                        <input className="inputStyling" type='number' value={currInput} onChange={(event) => setCurrInput(event.target.value)} />
                        <select className="selectStyling" id='dexChoice'>
                            <option value="energy">ENRG</option>
                            <option value="currency">CRNC</option>
                            </select>
                        </div>
                        <div id="innerright">
                        <p id="calcSwap" className="stakingLabel">For {calculateExchangeRate()} Energy</p>
                        <input type='button' className="center buttonStyle" id="exchangebutton"  value='Exchange' onClick={() => exchangeCurrency()} />
                        </div></div></div>







                    <div id='stake'>
                        <h2 className='title subheading'>STAKING</h2>
                        <div className="cstake">
                            <div className="stakingLabel">Currency:</div>
                            <input className="inputStyling" type='number' value={currencyStaked} onChange={(event) => setCurrencyStaked(event.target.value)} />
                        </div>
                        <div className="estake">
                            <div className="stakingLabel">Energy:</div>
                            <input  className="inputStyling"  type='number' value={energyStaked} onChange={(event) => setEnergyStaked(event.target.value)} />
                        </div><div className="flex">
                        <input id="stakebutton" className="buttonStyle" type='button' value='Stake' onClick={() => stakeCurrency()} />
                        <input id="unstakebutton" className="buttonStyle" type='button' value='Unstake' onClick={() => unstakeCurrency()} />
                        
                        </div></div>
                </div>
            <div id="right">
                <div id='staked_stats'>
                    <h2 className="subheading">Staking Stats</h2>
                    <div id="statTable" className="flex">
                    <p id="calcRewards" className="stakingLabel">Staking Rewards:<div> {calculateRewards()} energy</div> </p>
                    <input id="rewardsbutton" className="buttonStyle" type='button' value='Claim' onClick={() => claimRewards()} />
                    <div id="rewardInfo"></div>
                    </div>
                    <div id="statChart"></div>
                    <ul>
                        {/* {placeholder_items.map((item, index) =>
                            <li key={index}>
                                {item.item_name}: {item.item_desc} Quantity: {item.quantity}
                            </li>
                        )} */}
                    </ul>
                </div>
                </div>
            </div>
        </>
    )
}