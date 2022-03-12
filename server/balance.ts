import { Response, Request } from "express"
import { ethers } from "ethers"
import monsters from "./monsters";
import { generate_metadata } from "./create_image";

// GENERATES RANDOM FILE URL
const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
const allNumbers = [..."0123456789"];

const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];

const generator = (base, len) => {
    return [...Array(len)]
        .map(i => base[Math.random() * base.length | 0])
        .join('');
};

import csvAppend from "csv-append";
const RELATIVE_PATH_TO_CSV = `monsters.csv`;
const { append, end } = csvAppend(RELATIVE_PATH_TO_CSV, true);

const provider = ethers.getDefaultProvider("ropsten");

export const get_balance = async (req: Request, res: Response): Promise<void> => {
    try {

        const address = req.params.wallet_address;

        // get view from contract
        let result = await provider.getBlockNumber();

        // result will return currency, energy, and monster id's

        let monsters_to_return = [];

        const keys = [1, 2, 3, 4, 5]

        for (let i = 0; i < keys.length; i++) {
            // check if image is generated for nft
            if (!(keys[i] in monsters)) {
                monsters[keys[i]] = await generate_metadata(generator(base, 28))
                // save to csv file
                append({ id: keys[i], metadata: JSON.stringify(monsters[keys[i]]) })
            }
            monsters_to_return.push({ id: keys[i], metadata: monsters[keys[i]] })
        }
        // close file
        await end();


        // build object to return
        // let currency = result.currency;
        // let energy = result.energy;
        const balance = {
            currency: 0,
            energy: 0,
            monsters: monsters_to_return
        }


        res.status(200).json({ balance });

    } catch (error) {

        res.status(400).json({ error: error });

    }
}