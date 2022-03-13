import { useEffect, useState } from "react";
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import { getBalance, getImagesFromIds } from "../../api/api";
import { BigNumber } from "ethers";
let rawdata = require("../../api/contracts/Staking.json");
let bt_token = require('../../api/build/contracts/BTokens.json');
//import { fs } from 'fs' 

interface LiquidityPoolsProps {
}


export const LiquidityPoolsPage: React.FC<LiquidityPoolsProps> = ({ }) => {

   // const [{ data: accountData }] = useAccount();
  //  const [balance, setBalance] = useState<any>();

    // token amount
    const [currInput, setCurrInput] = useState<string>('');
    // token type
    const [tokenInput, setTokenInput] = useState<string>('');
    // currency staked
    const [currencyStaked, setCurrencyStaked] = useState<string>('');
    // energy staked
    const [energyStaked, setEnergyStaked] = useState<string>('');


/*

// SWAP  

// calculation useContractRead
    //inputs amount and id

    const [{ data, error, loading }, read] = useContractRead(
        {
          addressOrName: '0x45c003b90748890F05Ff402C4ff01F6AFf8E779E',
          contractInterface: rawdata.abi,
        },
        'CalculateRewardRate',
        {
            args: {currInput, tokenInput},
            overrides: {gasLimit: BigNumber.from('7000000')}

        }
        
      )

//exchange useContractWrite
    // inputs amount and id 

    const [{ data, error, loading }, write] = useContractWrite(
        {
          addressOrName: '0x45c003b90748890F05Ff402C4ff01F6AFf8E779E',
          contractInterface: rawdata.abi,
        },
        'swapCurrency',
        {
            args: { tokenInput, currInput },
            overrides: { from: '0x6f9C8B1f7257D91819e60BCbbCA10F622398c156', gasLimit:BigNumber.from('7000000')}
        }
    )


// Staking Rewards 

    //calculate rewardrate  useContractRead - not shown but needs to be called for the latter
        //inputs currency amount and energy amount and the msg.sender

        const [{ data, error, loading }, read] = useContractRead(
            {
              addressOrName: '0x45c003b90748890F05Ff402C4ff01F6AFf8E779E',
              contractInterface: rawdata.abi,
            },
            'CalculateRewardRate',
            {
                args: {currencyStaked, energyStaked},
                overrides: {from: '0x6f9C8B1f7257D91819e60BCbbCA10F622398c156', gasLimit: BigNumber.from('7000000')}
                    //needs to return rewardRate and LastClaim
            } 
          )
    //calculate reward amount useContractRead
        // inputs reward rate + last claim
    const [{ data, error, loading }, read] = useContractRead(
        {
            addressOrName: '0x45c003b90748890F05Ff402C4ff01F6AFf8E779E',
            contractInterface: rawdata.abi,
        },
        'CalculateRewardAmount',
        {
            args: {rewardRate, LastClaim},
            overrides: {from: '0x6f9C8B1f7257D91819e60BCbbCA10F622398c156', gasLimit: BigNumber.from('7000000')}
        }
        )

    //claim rewards useContractWrite
        //inputs = msg.sender that's it
    const [{ data, error, loading }, write] = useContractWrite(
        {
            addressOrName: '0x45c003b90748890F05Ff402C4ff01F6AFf8E779E',
            contractInterface: rawdata.abi,
        },
        'ClaimReward',
        {
            overrides: { from: '0x6f9C8B1f7257D91819e60BCbbCA10F622398c156', gasLimit:BigNumber.from('7000000')}
        }
    )


//STAKING  useContractWrite
    //inputs energy amount and currency amount
    const [{ data, error, loading }, write] = useContractWrite(
        {
          addressOrName: '0x45c003b90748890F05Ff402C4ff01F6AFf8E779E',
          contractInterface: rawdata.abi,
        },
        'StakeTokens',
        {
            args: { currencyStaked, energyStaked },
            overrides: { from: '0x6f9C8B1f7257D91819e60BCbbCA10F622398c156', gasLimit:BigNumber.from('7000000')}
        }
    )


// UNSTAKING useContractWrite
    //inputs energy amount and currency amount
    const [{ data, error, loading }, write] = useContractWrite(
        {
          addressOrName: '0x45c003b90748890F05Ff402C4ff01F6AFf8E779E',
          contractInterface: rawdata.abi,
        },
        'UnstakeTokens',
        {
            args: { currencyStaked, energyStaked },
            overrides: { from: '0x6f9C8B1f7257D91819e60BCbbCA10F622398c156', gasLimit:BigNumber.from('7000000')}
        }
    )

      
 /*     useEffect(() => Promise<{ data?: Result; error?: Error }>
        if (!accountData?.address) {
            return;
        }
        (async () => {
            try {
                
                    
            
                    config: {
                      args: any | any[]
                      overrides?: Overrides
                    } = {},
                  ) 
                  
                console.log(accountData?.address)
                const response = await getBalance({
                    wallet_address: accountData?.address,
                });
                setBalance(response.data.balance);
            } catch (error: any) {
                console.error(error);
            }
        })();
      
    },  [accountData?.address, data]);
   

    let amount = Number(currInput);
    let id = Number(tokenInput);

    const [{ data, error, loading }, write] = useContractWrite(
        {
          addressOrName: '0x45c003b90748890F05Ff402C4ff01F6AFf8E779E',
          contractInterface: rawdata.abi,
        },
        'swapCurrency',
        {
            args: [id, amount],
        }
    )

    useEffect(() => {
        if (!accountData?.address) {
            return;
        }
        (async () => {
            try {
                console.log(accountData?.address)
                const response = await getBalance({
                    wallet_address: accountData?.address,
                });
                setBalance(response.data.balance);
            } catch (error: any) {
                console.error(error);
            }
        })();


    }, [accountData?.address, data]);

    const exchangeToken = async() => {
        console.log("swapping token");
        console.log(id);
        console.log(amount);

        await write()
        console.log("wrote")
        try {
            const response = await getBalance({
                wallet_address: accountData?.address,
            });
            console.log(response.data.balance)
            setBalance(response.data.balance);
        } catch (error: any) {
            console.error(error);
        } 
    };

    useEffect(() => {
        if (balance === undefined) {
            return;
        }

        if (!balance || balance.monsters.length < 1) {
            return;
        }
        (async () => {
            try {
                for (let i = 0; i < balance.monsters.length; i++) {
                    const response = await getImagesFromIds({
                        id: balance.monsters[i].id,
                    });
                    console.log('image fetched');
                    setImages((images: any) => ({ ...images, [`${balance.monsters[i].id}`]: response.data }));
                }

            } catch (error: any) {
                console.log('error')
                console.error(error);
            }
        })();


    }, [balance]);

     // unimplemented   
    // fetch exchange rate
    const calculateExchangeRate = () => {
        // useContractWrite() 
        let num = Number(currInput) * 1.15;
        return num.toFixed(0);
        //  function CalculateRewardRate(uint _currency, uint _energy) public view returns (uint rewardRate6)
    }
   */ 
    const determineToken = () => {

    }

    const calculateExchangeRate = () => {}
    
    const exchangeToken = async() => {}
  

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
        let num = Number(currInput) * 1.15;
        return num.toFixed(0);
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
                        <select className="selectStyling" id='dexChoice' value={tokenInput} onChange={(event) => setTokenInput(event.target.value)}>
                            <option value="0">ENRG</option>
                            <option value="1">CRNC</option>
                            </select>
                        </div>
                        <div id="innerright">
                        <p id="calcSwap" className="stakingLabel">For {calculateExchangeRate()} {determineToken()}</p>
                        <input type='button' className="center buttonStyle" id="exchangebutton"  value='Exchange' onClick={exchangeToken} />
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
                    <div id="calcRewards" className="stakingLabel">Staking Rewards:<div> {calculateRewards()} energy</div> </div>
                    <input id="rewardsbutton" className="buttonStyle" type='button' value='Claim' onClick={() => claimRewards()} />
                    </div>
                    <div className="stakingLabel" id="rewardInfo">info example</div>
                    <div id="statChart">
                    </div>
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