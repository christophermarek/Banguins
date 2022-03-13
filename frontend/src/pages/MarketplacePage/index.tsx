import React, { useEffect, useState } from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useAccount, useContractWrite, useContractRead } from "wagmi";
import { getBalance, getImagesFromIds } from "../../api/api";
import { BigNumber } from "ethers";
let bt_token = require('../../api/build/contracts/BTokens.json');


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
        { img_src: '/img/store-fish.png', quantity: 20, item_name: 'Fish', item_desc: 'Distract the opponent for a turn with a succulent fish' },
        { img_src: '/img/store-flippers.png', quantity: 20, item_name: 'Frozen Flippers', item_desc: 'Active Penguin Deals 10% more damage for the remainder of the battle ' },
        { img_src: '/img/store-coin.png', quantity: 20, item_name: 'Double Coin', item_desc: 'Use on your first turn to earn double reward if you win, but losing gets you nothing.' },
        { img_src: '/img/store-potion.png', quantity: 20, item_name: 'Potion', item_desc: 'Restores the health of a penguin on your team' }
    ]

    
    const [currInput, setCurrInput] = useState<string>('');

    const [{ data: accountData }] = useAccount();

    const [balance, setBalance] = useState<any>();
    // map of monster id to image base64 data
    const [images, setImages] = useState<any>();

    const [{ data, error, loading }, write] = useContractWrite(
        {
          addressOrName: '0x066b7E91e85d37Ba79253dd8613Bf6fB16C1F7B7',
          contractInterface: bt_token.abi,
        },
        'buyPack',
        {
            args: [accountData?.address],
            overrides: {value: BigNumber.from('3'), gasLimit: BigNumber.from('7000000')}
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



    const buy_deck = async() => {
        console.log("beggining deck purchase");

        await write()

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

    const buyItems = () => {
        // create transaction popup
        // send transaction
        alert('Items Bought');
    }
    
    const calculateNumberPacksCost = () => {
        return Number(currInput) * 3;
    } 

    return (
        <>
            <h1 className="heading">Marketplace</h1>

            <div id='mp'>

                <div id='left'>

                    <div id='mint_pack'>
                        <h2 className="subheading">Mint a Pack for 3 MATIC</h2>
                        <p className="subsubheading" >Limit 3 packs per week.</p>
                        <div className="flex center">
                        <input className="inputStyling" max='99' type='number' value={currInput} onChange={(event) => setCurrInput(event.target.value)} />
                        <div className="stakingLabel">For {calculateNumberPacksCost()} MATIC</div>
                        </div>
                        <input type='button' className="buttonStyle" value='Mint Pack' onClick={buy_deck} />
                        </div> 
                        <SimpleGrid w="full" minChildWidth={160} spacing={20}>
                        {!accountData?.address ?
                            (
                                <p>You have no cards</p>
                            )
                            : (
                                balance && images &&
                                <>
                        {balance.monsters.map((monster: any) => 
                                        (
                                            <Box
                                            boxShadow="xl"
                                            backgroundColor="tangaroa.100"
                                            key={monster.id}
                                            height={48}
                                            borderRadius={10}
                                            p={4}
                                        >
                                            <p>ID:{monster.id}</p>
                                            <img src={images[monster.id]}/>
                                        </Box>
                                        )
                                    )}
                                    </>
                                )
                            }
                    </SimpleGrid>
                              
                </div>
                <div id='right'>
                <div id='general_store'>
                    <h1 className="subheading">General Store</h1>
                    <ul className="itemList">
                        {placeholder_items.map((item, index) =>
                            <li key={index}>
                                <img src={item.img_src} /><span className="stakingLabel">{item.item_name} Quantity: {item.quantity}</span><p>{item.item_desc}</p>
                            </li>
                        )}
                    </ul>
                    <div id='buyItems'>
                        <div id="storeTotal" className="stakingLabel" >Cost {calculateNumberPacksCost()} MATIC</div>
                        <div className="sbCont"><input id="storebutton" className="buttonStyle" type='button' value='Buy' onClick={() => buyItems()} /></div>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}