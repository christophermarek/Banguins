import { Response, Request } from "express"
import { create } from 'ipfs-http-client';

// connect with pinata
const client = create({url:`https://ipfs.infura.io:5001/api/v0`})

export const generate_nfts_and_upload = async (req: Request, res: Response): Promise<void> => {
    try {

        const wallet_id = req.params.wallet_id;

        // REPEAT 7 TIMES?

        // STEPS

        // 1. GENERATE NFT METADATA

        // 2. GENERATE IMAGE FILE FROM METADATA

        // 3. APPLY STYLE TRANSFER

        let nft_url = undefined;
        // https://dev.to/dabit3/uploading-files-to-ipfs-from-a-web-application-50a
        // 4. UPLOAD TO IPFS
        try {
            let file = undefined;
            const added = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            nft_url(url)

        } catch (error) {
            res.status(400).json({error: 'Error uploading file: ' + error})
        }


        // 5. SEND TRANSACTION TO SMART CONTRACT WITH URL TO NFT PIC AND METADATA



        res.status(200).json({ success: true });

    } catch (error) {

        res.status(400).json({ error: error });

    }
}