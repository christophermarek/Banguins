import React, { useEffect, useState } from "react";
import { card } from "../../types";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { getBalance, getImagesFromIds } from "../../api/api";
import { isConstructorDeclaration } from "typescript";

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
                    wallet: accountData?.address,
                });
                console.log(response.data.balance)
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
    let placeholder_cards: card[] = [];
    for (let i = 0; i < 9; i++) {
        placeholder_cards[i] = {
            health: i + 1,
            attack: i + 1,
            address: `0x082B6aC9e47d7D83ea3FaBbD1eC7DAba9D687b3${i}`,
        };
    }

    const visibleDeck = placeholder_cards.slice(0, 8);

    // implement these, props from app.ts?
    // const energy = 100;
    // const currency = 100;

    //unimplemented
    const buy_deck = () => {
        console.log("beggining deck purchase");
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
