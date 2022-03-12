import React from "react";
import { card } from "../../types";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";

export const HomePage: React.FC = () => {
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
                        {visibleDeck.map((card: card, index: any) => (
                            <Box
                                boxShadow="xl"
                                backgroundColor="tangaroa.100"
                                key={index}
                                height={48}
                                borderRadius={10}
                                p={4}
                            >
                                <Text fontSize="lg">Card</Text>
                                <Text>{card.address}</Text>
                            </Box>
                        ))}
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
