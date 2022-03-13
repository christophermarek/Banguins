import { Box, Button, ButtonGroup, Heading, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { card } from "../../types";
import { IoIosRefresh } from "react-icons/io";
import { registerCallback, removeCallback, socket } from "../../socket";
import { getLobbies, createLobby, getImagesFromIds, getBalance } from "../../api/api";
import { getRandomString } from "../../utils/random";
import { useAccount } from "wagmi";

export const LobbiesPage: React.FC = () => {
    const navigate = useNavigate();
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


    }, [balance])

    const loadDataFromServer = React.useCallback(async () => {
        // CHANGE THIS To 24 hours once real time stream is up
        // FIXME: API sometimes returns null entries, so we have to filter those,
        let lobbies_fetched = (await getLobbies())?.data?.lobbies?.filter((item: any) => item);

        setLobbies(lobbies_fetched);
    }, []);


    React.useEffect(() => {
        loadDataFromServer();
    }, [loadDataFromServer]);



    // lobby id returned from server after successful lobby creation
    const [createdLobbyId, setCreatedLobbyId] = useState<any>(undefined);

    const [lobbies, setLobbies] = useState<any>([]);

    const [selectedCards, setSelectedCards] = useState<any>([]);

    const onBattle = React.useCallback((data: any) => {
        if (data) {
            navigate(`/battle/${createdLobbyId}/${selectedCards}`);
        }
    }, [createdLobbyId, navigate, selectedCards]);

    React.useEffect(() => {
        const callbackId = getRandomString();
        registerCallback(callbackId, "battle", onBattle);

        return () => {
            removeCallback(callbackId, "battle");
        };
    }, [onBattle]);

    interface lobbies_display {
        date_created: string;
        opponent_id: string;
        lobby_id: number;
    }

    const join_lobby = async (lobby_id: number) => {
        if (window.confirm(`Are you sure you want to join this lobby?`)) {
            if (selectedCards.length !== 3) {
                alert("Must select 3 cards");
                return;
            }
            console.log('going to battle')
            navigate(`/battle/${lobby_id}/${selectedCards}`);
        }
    };

    // cards_selected is the array of card address's
    const handleCreateLobby = async () => {
        if (selectedCards.length !== 3) {
            alert("Only Select 3 cards");
            return;
        }

        // fetch cards from addresses to pass as cards_selected

        // post server
        try {
            const response = await createLobby({
                wallet: accountData?.address,
                cards: selectedCards,
                socketId: socket.id,
            });

            // check for error, lobby already made
            if ("message" in response.data) {
                alert(response.data.message);
            } else {
                alert(
                    `Successfully created lobby with id=${response.data.lobby_id}, now wait in lobbies until opponent joined`
                );
                setCreatedLobbyId(response.data.lobby_id);
                loadDataFromServer();
                console.log(response.data.lobby_id)
            }
        } catch (error: any) {
            alert("Error creating lobby");
        }
        // if success then alert client saying successfully created, dont leave screen until opponent joined
    };

    const cardSelected = (address: string) => {
        // check if remove or add
        if (selectedCards.includes(address)) {
            // delete
            setSelectedCards(selectedCards.filter((item: any) => item !== address));
        } else {
            setSelectedCards((selectedCards: any) => [...selectedCards, address]);
        }
    };


    return (
        <>
            <Button variant="ghost" leftIcon={<FaChevronLeft />} onClick={() => navigate(-1)} mb={5}>
                Go back
            </Button>
            <VStack alignItems="flex-start" spacing={10} w="full">
                <VStack w="full" spacing={4} alignItems="flex-start">
                    <Heading>Your Cards</Heading>
                    <SimpleGrid w="full" minChildWidth={160} spacing={10}>
                        {balance && images &&
                            <>
                                {
                                    balance.monsters.map((monster: any) =>
                                    // console.log(monster)
                                        <div 
                                            key={monster.id}
                                            onClick={() => cardSelected(monster.id)}
                                            className={(selectedCards.includes(monster.id) ? 'selected ' : '') + "grid_item"}
                                        >
                                            <div>
                                                <Text fontSize="lg">Card {monster.id}</Text>
                                            </div>
                                            <img src={images[monster.id]} />
                                            <div id='lowercard'>
                                                <Text id='lowerRigtht'>Health {monster.metadata.health}</Text>
                                                <Text>Attack{monster.metadata.attack}</Text>
                                            </div>
                                        </div>
                                    )
                                }
                            </>
                             
                        }
                    </SimpleGrid>
                </VStack>
                <VStack w="full" spacing={4} alignItems="flex-start">
                    <HStack w="full" alignItems="center" justifyContent="space-between">
                        <Heading>Lobbies</Heading>
                        <ButtonGroup>
                            <Button variant="ghost" leftIcon={<IoIosRefresh />} onClick={() => loadDataFromServer()}>
                                Refresh
                            </Button>
                            <Button onClick={handleCreateLobby} disabled={selectedCards.length !== 3}>
                                Create lobby
                            </Button>
                        </ButtonGroup>
                    </HStack>
                    {lobbies.map((lobby: lobbies_display) => (
                        <HStack
                            alignItems="flex-start"
                            w="full"
                            key={lobby.lobby_id}
                            borderWidth={1}
                            borderRadius={6}
                            p={4}
                        >
                            <VStack alignItems="flex-start" w="full">
                                <Text>ID: {lobby.lobby_id}</Text>
                                <Text>Oponent: {lobby.opponent_id}</Text>
                                {lobby.lobby_id === createdLobbyId && (
                                    <Text fontSize="sm" color="blackAlpha.600">
                                        This is your lobby
                                    </Text>
                                )}
                            </VStack>
                            <Button onClick={() => join_lobby(lobby.lobby_id)}>Join</Button>
                        </HStack>
                    ))}
                </VStack>
            </VStack>
        </>
    );
};
