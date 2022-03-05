import { Router } from "express"
import { generate_nfts_and_upload } from "./nft"

const router: Router = Router()

router.get('/', (req, res) => {
    res.send('Server is running!')
})

router.get('/nft/:wallet_id', generate_nfts_and_upload)

export default router;