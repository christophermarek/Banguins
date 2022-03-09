import { Button, Flex, Link, Spacer } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import WalletInfo from "../WalletInfo";
import styles from "./styles.module.scss";

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigate = React.useCallback(
        (route: string) => {
            navigate(route);
        },
        [navigate]
    );

    return (
        <Flex flexDirection="row" alignItems="center" gap={4} padding={4}>
            <Link onClick={() => handleNavigate("/")}>
                <img src={logo} className={styles.logo} />
            </Link>
            <Spacer />
            <Button variant="ghost" onClick={() => handleNavigate("/")}>
                Home
            </Button>
            <Button variant="ghost" onClick={() => handleNavigate("/marketplace")}>
                Marketplace
            </Button>
            <Button variant="ghost" onClick={() => handleNavigate("/liquidity-pools")}>
                Liquidity Pools
            </Button>
            <WalletInfo />
        </Flex>
    );
};

export default Header;
