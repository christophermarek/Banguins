"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_nfts_and_upload = void 0;
const ipfs_http_client_1 = require("ipfs-http-client");
// connect with pinata
const client = (0, ipfs_http_client_1.create)({ url: `https://ipfs.infura.io:5001/api/v0` });
const generate_nfts_and_upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet_id = req.params.wallet_address;
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
            const added = yield client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            nft_url(url);
        }
        catch (error) {
            res.status(400).json({ error: 'Error uploading file: ' + error });
        }
        // 5. SEND TRANSACTION TO SMART CONTRACT WITH URL TO NFT PIC AND METADATA
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.generate_nfts_and_upload = generate_nfts_and_upload;
