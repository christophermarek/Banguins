import { useContractRead } from "wagmi";


export const hi = 'hello';

export const useGetBalance = async() => {
    const [{ data, error, loading }, read] = useContractRead(
        {
            addressOrName: '0x066b7E91e85d37Ba79253dd8613Bf6fB16C1F7B7',
            contractInterface: './build/contracts/BTokens.json',
        },
        'balanceOfPlayer',
        {
            args: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
        }
    )
    return read;
}