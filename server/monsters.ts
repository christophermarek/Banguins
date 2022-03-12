import { nft_metadata } from "./create_image";

// dictionary, monster id will point to the image url on server
let monsters: { [monster_id: number]: nft_metadata} = {}

export default monsters;