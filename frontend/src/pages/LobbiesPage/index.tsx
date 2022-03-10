import { Box, Button, ButtonGroup, Heading, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";

import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BattleView } from "../../components/BattleView";
import { socket, socket_id } from "../../socket";
import { card } from "../../types";
import { IoIosRefresh } from "react-icons/io";

let baseUrl: string;
// is production
if (true) {
    baseUrl = "https://banguins.herokuapp.com";
} else {
    baseUrl = "http://localhost:8000";
}

export const LobbiesPage: React.FC = () => {
    const navigate = useNavigate();

    let placeholder_cards: card[] = [];
    for (let i = 0; i < 8; i++) {
        placeholder_cards[i] = { health: i + 1, attack: i + 1, address: `#0xaqwqesad${i}` };
    }

    const loadDataFromServer = React.useCallback(async () => {
        // CHANGE THIS To 24 hours once real time stream is up
        // FIXME: API sometimes returns null entries, so we have to filter those,
        let lobbies_fetched = (await get_lobbies())?.lobbies?.filter((item: any) => item);

        setLobbies(lobbies_fetched);
    }, []);

    useEffect(() => {
        loadDataFromServer();

        socket.on("battle", (data) => {
            if ("winner" in data) {
                alert(data);
                console.log(data);
                loadDataFromServer();
                setBattleView(false);
                setBattle(undefined);
            } else if ("opponent_left" in data) {
                alert("Opponent left your lobby");
                loadDataFromServer();
                setBattleView(false);
                setBattle(undefined);
            } else {
                setBattle(data);
                setBattleView(true);
            }
        });
    }, [loadDataFromServer]);

    const [battleView, setBattleView] = useState<boolean>(false);

    // https://banguins.herokuapp.com/
    // lobby id returned from server after successful lobby creation
    const [createdLobbyId, setCreatedLobbyId] = useState<any>(undefined);

    const [lobbies, setLobbies] = useState<any>([]);
    // cant define interfaces because this is just placeholder for now
    const [battle, setBattle] = useState<any>();

    const [selectedCards, setSelectedCards] = useState<any>([]);

    const [deck, setDeck] = useState<card[]>(placeholder_cards);

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

            // use addresses from cards_selected to fetch cards we pass to server
            let cards = [];
            for (let i = 0; i < selectedCards.length; i++) {
                let card_found: card = deck.filter(function (sel_card: card) {
                    return sel_card.address === selectedCards[i];
                })[0];
                cards.push(card_found);
            }

            // post server
            try {
                const response: AxiosResponse<any> = await axios.post(baseUrl + "/join_lobby", {
                    wallet: "0xwallet",
                    cards: cards,
                    lobby_id: lobby_id,
                    socketId: socket_id,
                });

                console.log(response.data);
            } catch (error: any) {
                alert("Error creating lobby");
            }

            // setBattleView(true)
        }
    };

    const get_lobbies = async () => {
        try {
            const response: AxiosResponse<any> = await axios.get(baseUrl + "/get_lobbies");
            return response.data;
        } catch (error: any) {
            alert("Error creating lobby");
        }
    };

    // cards_selected is the array of card address's
    const createLobby = async () => {
        if (selectedCards.length !== 3) {
            alert("Only Select 3 cards");
            return;
        }

        // use addresses from cards_selected to fetch cards we pass to server
        let cards = [];
        for (let i = 0; i < selectedCards.length; i++) {
            let card_found: card = deck.filter(function (sel_card: card) {
                return sel_card.address === selectedCards[i];
            })[0];
            cards.push(card_found);
        }

        // fetch cards from addresses to pass as cards_selected

        // post server
        try {
            const response: AxiosResponse<any> = await axios.post(baseUrl + "/create_lobby", {
                wallet: "0xwallet",
                cards: cards,
                socketId: socket_id,
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

    const update_placeholder_health = (event: any, index: any) => {
        let copy = [...deck];
        copy[index].health = event.target.value;
        setDeck(copy)
    }

    const update_placeholder_attack = (event: any, index: any) => {
        let copy = [...deck];
        copy[index].attack = event.target.value;
        setDeck(copy)
    }

    return (
        <>
            {battleView ? (
                battle !== undefined && <BattleView setBattleView={setBattleView} battle={battle} />
            ) : (
                <>
                    <Button variant="ghost" leftIcon={<FaChevronLeft />} onClick={() => navigate(-1)} mb={5}>
                        Go back
                    </Button>
                    <VStack alignItems="flex-start" spacing={10} w="full">
                        <VStack w="full" spacing={4} alignItems="flex-start">
                            <Heading>Your Cards</Heading>
                            <SimpleGrid w="full" minChildWidth={160} spacing={10}>
                                {deck.map((card: card, index: any) => {
                                    const selected = selectedCards.includes(card.address);

                                    return (
                                        <Box
                                            cursor="pointer"
                                            key={index}
                                            height={48}
                                            borderRadius={10}
                                            _hover={{
                                                backgroundColor: "tangaroa.200",
                                            }}
                                            _active={{
                                                backgroundColor: "tangaroa.300",
                                            }}
                                            p={4}
                                            onClick={() => cardSelected(card.address)}
                                            boxShadow={selected && "xl"}
                                            backgroundColor={selected ? "oldenAmber.200" : "tangaroa.100"}
                                        >
                                            <Text fontSize="lg">Card</Text>
                                            <Text>{card.address}</Text>
                                            <Text>Health <input type='number' value={deck[index].health} onChange={(event) => update_placeholder_health(event, index)} /></Text>
                                            <Text>Attack <input type='number' value={deck[index].attack} onChange={(event) => update_placeholder_attack(event, index)} /></Text>

                                        </Box>
                                    );
                                })}
                            </SimpleGrid>
                        </VStack>
                        <VStack w="full" spacing={4} alignItems="flex-start">
                            <HStack w="full" alignItems="center" justifyContent="space-between">
                                <Heading>Lobbies</Heading>
                                <ButtonGroup>
                                    <Button variant="ghost" leftIcon={<IoIosRefresh />} onClick={() => loadDataFromServer()}>
                                        Refresh
                                    </Button>
                                    <Button onClick={createLobby} disabled={selectedCards.length !== 3}>
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
            )}
        </>
    );
};


