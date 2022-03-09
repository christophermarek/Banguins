import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { useAccount, useConnect } from "wagmi";
import ConnectButton from "../ConnectButton";
import { FaChevronDown } from "react-icons/fa";
import { BiExit } from "react-icons/bi";
import { shortenAddress } from "../../utils/address";

const WalletInfo: React.FC = () => {
    const [{ data: accountData }, disconnect] = useAccount();
    const [{ data: connectData }] = useConnect();

    const handleDisconnect = React.useCallback(() => {
        disconnect();
    }, [disconnect]);

    if (!connectData.connected) {
        return <ConnectButton />;
    }

    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<FaChevronDown />}>
                {shortenAddress(accountData?.address)}
            </MenuButton>
            <MenuList>
                <MenuItem icon={<BiExit />} onClick={handleDisconnect}>
                    Disconnect
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default WalletInfo;
