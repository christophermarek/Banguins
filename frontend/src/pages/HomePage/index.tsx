import React, { useEffect, useState } from "react";
import { card } from "../../types";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useAccount, useContractRead } from "wagmi";
import { getBalance, getImagesFromIds } from "../../api/api";
import { isConstructorDeclaration } from "typescript";
import { useGetBalance } from "../../api/contract_api";

export const HomePage: React.FC = () => {
    const [{ data: accountData }] = useAccount();

    const [balance, setBalance] = useState<any>();
    // map of monster id to image base64 data
    const [images, setImages] = useState<any>();

    useEffect(() => {
        if (!accountData?.address) {
            return;
        }
        (async () => {
            try {
                const response = await getBalance({
                    wallet_address: accountData?.address,
                });
                setBalance(response.data.balance);
            } catch (error: any) {
                console.error(error);
            }
        })();


    }, [accountData?.address]);

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

    const navigate = useNavigate();

    //unimplemented
    const buy_deck = async() => {
        console.log("beggining deck purchase");
        // console.log(await read())
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

    const handleNavigateToLobbies = React.useCallback(() => {
        navigate("/lobbies");
    }, [navigate]);

    return (
        <>
            <VStack w="full" spacing={10} alignItems="flex-start">
                <VStack className='deck_viewer'
                    spacing={6}

                    alignItems="flex-start"
                    w="full"
                    borderRadius={20}
                    p={10}
                    boxShadow="2xl"
                >
                    <HStack justifyContent="space-between" w="full">
                        <Heading id='outlinetext' color="white">Your Cards</Heading>
                        <Button id='outlinetext' variant="ghost" colorScheme="whiteAlpha">
                            View more
                        </Button>
                    </HStack>
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
                </VStack>


                <HStack id='here' w="full" spacing={20}>
                    <VStack flex={1} spacing={4} alignItems="flex-start">
                        <Heading id='outlinetext'>Buy a deck</Heading>
                        <Button variant="outline" onClick={buy_deck}>
                            Buy deck
                        </Button>
                    </VStack>
                    <VStack className="ontop" flex={1} spacing={4} alignItems="flex-start">
                        <Heading id='outlinetext'>Find a match</Heading>
                        <Button variant="outline" onClick={handleNavigateToLobbies}>
                            Lobbies
                        </Button>
                    </VStack>
                </HStack>
            </VStack>
        </>
    );
};
