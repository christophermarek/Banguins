export function shortenAddress(address?: string) {
    if (!address) return null;
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
}
