import { Response, Request } from "express"
import { ethers } from "ethers"
import monsters from "./monsters";
import { generate_metadata } from "./create_image";
"use strict";

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

const provider = ethers.getDefaultProvider("rinkeby");
const fs = require('fs');

export const get_balance = async (req: Request, res: Response): Promise<void> => {
    console.log('get balance route');
    try {
        console.log(req.params)
        const address = req.params.wallet_id;
        console.log(address)
        if(!address){
            res.status(400).json({ error: 'invalid address' });
            return;
        }
        // get view from contract
        const contract_address = '0x066b7E91e85d37Ba79253dd8613Bf6fB16C1F7B7';

        let rawdata = fs.readFileSync('./contracts/BTokens.json');
        let parsed_json = JSON.parse(rawdata);

        let contract = new ethers.Contract(contract_address, parsed_json.abi, provider);
        let player_bal = await contract.balanceOfPlayer(address)

        const energy = Number(ethers.utils.formatEther(player_bal[1][0])) * 10 ** 18;
        const currency = Number(ethers.utils.formatEther(player_bal[1][1])) * 10 ** 18;

        let keys = [];
        if(player_bal[0].length > 2){
            for(let i = 2; i < player_bal[0].length; i++){
                // console.log(ethers.utils.formatEther(player_bal[0][i]))
                keys.push(Number(ethers.utils.formatEther(player_bal[0][i])) * 10 ** 18)
                if((Number(ethers.utils.formatEther(player_bal[1][i])) * 10 ** 18) > 1){
                    keys.push(Number(ethers.utils.formatEther(player_bal[0][i])) * 10 ** 18)
                }
            }
        }
        console.log(keys)
        // result will return currency, energy, and monster id's
        let monsters_to_return = [];

        // const keys = [1, 2, 3, 4, 5];

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


        // build object to return
        // let currency = result.currency;
        // let energy = result.energy;
        const balance = {
            currency: currency,
            energy: energy,
            monsters: monsters_to_return
        }


        res.status(200).json({ balance });

    } catch (error) {

        res.status(400).json({ error: error });

    }
}