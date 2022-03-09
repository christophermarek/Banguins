import { Button } from "@chakra-ui/react";
import React from "react";
import { useConnect } from "wagmi";

const ConnectButton: React.FC = () => {
    const [{ data, error, loading }, connect] = useConnect();

    const handleConnect = React.useCallback(() => {
        const connector = data?.connectors?.find((item) => item.id === "injected");

        if (!connector) {
            return;
        }

        connect(connector);
    }, [connect]);

    return (
        <Button onClick={handleConnect} isLoading={loading}>
            Connect wallet
        </Button>
    );
};

export default ConnectButton;
