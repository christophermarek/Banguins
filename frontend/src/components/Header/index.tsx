import { Button, Flex, Link, Spacer } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import WalletInfo from "../WalletInfo";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigate = React.useCallback(
        (route: string) => {
            navigate(route);
        },
        [navigate]
    );

    return (
        <Flex id='navbar' flexDirection="row" alignItems="center" gap={4} padding={4}>
            <Link onClick={() => handleNavigate("/")}>
                {/* <img src={logo} className={styles.logo} /> */}
                <p id='title'>Banguins</p>
            </Link>
            <Spacer />
            <Button className="navbtn" variant="ghost" onClick={() => handleNavigate("/")}>
                Home
            </Button>
            <Button className="navbtn" variant="ghost" onClick={() => handleNavigate("/marketplace")}>
                Marketplace
            </Button>
            <Button className="navbtn" variant="ghost" onClick={() => handleNavigate("/liquidity-pools")}>
                Liquidity Pools
            </Button>
            <WalletInfo />
        </Flex>
    );
};

export default Header;
