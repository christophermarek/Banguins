import path from "path";

const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const fs = require('fs');
const dirTree = require("directory-tree");


function get_random(list) {
    return list[Math.floor((Math.random() * list.length))];
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export const create_image = async (id: number) => {

    const files = fs.readdirSync('./images');

    const background_sel = get_random(files.filter(s => s.includes('background')));
    const body_sel = get_random(files.filter(s => s.includes('body')));
    const face_sel = get_random(files.filter(s => s.includes('face')));
    const feet_sel = get_random(files.filter(s => s.includes('feets')));
    const hat_sel = get_random(files.filter(s => s.includes('hat')));
    const outline_sel = get_random(files.filter(s => s.includes('outline')));
    const tummy_sel = get_random(files.filter(s => s.includes('tummy')));
    const weapon_sel = get_random(files.filter(s => s.includes('weapon')));

    let b4 = await mergeImages([`./images/${background_sel}`, `./images/${body_sel}`, `./images/${outline_sel}`, `./images/${feet_sel}`, `./images/${tummy_sel}`,
    `./images/${face_sel}`, `./images/${hat_sel}`, `./images/${weapon_sel}`], {
        Canvas: Canvas,
        Image: Image
    })

    // decode image uri to save as png
    function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response: any = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }

        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        return response;
    }

    var imageBuffer = decodeBase64Image(b4);
    fs.writeFile(`./output_images/${id}.png`, imageBuffer.data, function (err) { });
    const layers: image_layers_src = {
        background: background_sel.replaceAll('-', ' ').replaceAll('.png', '').split(" ").slice(1).join(" "),
        body: body_sel.replaceAll('-', ' ').replaceAll('.png', '').split(" ").slice(1).join(" "),
        face: face_sel.replaceAll('-', ' ').replaceAll('.png', '').split(" ").slice(1).join(" "),
        feet: feet_sel.replaceAll('-', ' ').replaceAll('.png', '').split(" ").slice(1).join(" "),
        hat: hat_sel.replaceAll('-', ' ').replaceAll('.png', '').split(" ").slice(1).join(" "),
        outline: outline_sel.replaceAll('-', ' ').replaceAll('.png', '').split(" ").join(" "),
        tummy: tummy_sel.replaceAll('-', ' ').replaceAll('.png', '').split(" ").slice(1).join(" "),
        weapon: weapon_sel.replaceAll('-', ' ').replaceAll('.png', '').split(" ").slice(1).join(" ")
    }
    return {ipfs_url: `./output_images/${id}.png`, layers}

}

interface image_layers_src{
    background: string,
    body: string,
    face: string,
    feet: string,
    hat: string,
    outline: string,
    tummy: string,
    weapon: string
}

interface nft_metadata{
    health: string,
    attack: string,
    ipfs_url: string,
    layers_src: image_layers_src
}


export const generate_metadata = async(id: number) => {

    let health = randomInteger(5, 20);
    let attack = randomInteger(3, 15);

    const image_data = await create_image(id)
    let nft_metadata: nft_metadata = {
        health: health,
        attack: attack,
        ipfs_url: image_data.ipfs_url,
        layers_src: image_data.layers
    }

    console.log(nft_metadata)

    return nft_metadata;
}


generate_metadata(1)
generate_metadata(2)
generate_metadata(3)
