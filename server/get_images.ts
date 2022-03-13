import { Response, Request } from "express"
import monsters from "./monsters";
import { promises as fs } from "fs";

export const get_image = async (req: Request, res: Response): Promise<void> => {
    try {

        console.log('sending image')
        const id = req.params.id;

        // get path from ids
        const path = monsters[id].ipfs_url;

        // read image file
        let data = (await fs.readFile(path));
        // get image file extension name
        // const extensionName = path.extname(path);

        // convert image file to base64-encoded string
        const base64Image = data.toString('base64');

        const final_uri = "data:image/png;base64, " + base64Image

        // res.end(image);
        res.status(200).json( final_uri );

    } catch (error) {

        res.status(400).json({ error: error });

    }
}