import React from "react";
import { LobbiesPage } from "../LobbiesPage";
import { card } from "../../types";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, HStack, Icon, Link, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa";

export const HomePage: React.FC = ({}) => {
    const navigate = useNavigate();
    let placeholder_cards: card[] = [];
    for (let i = 0; i < 9; i++) {
        placeholder_cards[i] = {
            health: i + 1,
            attack: i + 1,
            address: `0x082B6aC9e47d7D83ea3FaBbD1eC7DAba9D687b3${i}`,
        };
    }
    const deck = placeholder_cards;
    const visibleDeck = placeholder_cards.slice(0, 8);

    // implement these, props from app.ts?
    const energy = 100;
    const currency = 100;

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
                <VStack
                    spacing={6}
                    alignItems="flex-start"
                    backgroundColor="tangaroa.700"
                    w="full"
                    borderRadius={20}
                    p={10}
                    boxShadow="2xl"
                >
                    <HStack justifyContent="space-between" w="full">
                        <Heading color="white">Your Cards</Heading>
                        <Button variant="ghost" colorScheme="whiteAlpha">
                            View more
                        </Button>
                    </HStack>
                    <SimpleGrid w="full" minChildWidth={160} spacing={20}>
                        {visibleDeck.map((card: card, index: any) => (
                            <Box backgroundColor="tangaroa.100" key={index} height={48} borderRadius={10} p={4}>
                                <Text fontSize="lg">Card</Text>
                                <Text>{card.address}</Text>
                            </Box>
                        ))}
                    </SimpleGrid>
                </VStack>

                <VStack spacing={4} alignItems="flex-start">
                    <Heading>Buy a deck</Heading>
                    <Button variant="outline" onClick={buy_deck}>
                        Buy deck
                    </Button>
                </VStack>

                <VStack spacing={4} alignItems="flex-start">
                    <Heading>Find a match</Heading>
                    <Button variant="outline" onClick={handleNavigateToLobbies}>
                        Lobbies
                    </Button>
                </VStack>
            </VStack>
        </>
    );
};
