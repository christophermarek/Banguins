import { Router } from "express"
import { get_balance } from "./balance"
import { get_image } from "./get_images"
import { create_lobby, get_lobbies, join_lobby } from "./lobby"
import { generate_nfts_and_upload } from "./nft"

const router: Router = Router()

router.get('/', (req, res) => {
    res.send('Server is running!')
})


router.get('/balance', get_balance)

//nft routes 
// unused 
router.get('/nft/:wallet_address', generate_nfts_and_upload)

// game routes
router.get('/get_lobbies', get_lobbies)
router.post('/create_lobby', create_lobby)
router.post('/join_lobby', join_lobby)

router.get('/images/:id', get_image)

export default router;