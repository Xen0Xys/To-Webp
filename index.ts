import { readdirSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const files: string[] = readdirSync(join(__dirname, "images")).filter((fileName: string) => fileName !== ".gitkeep");

while(files.length !== 0){
    await Promise.all(files.splice(0, 5).map(async (fileName: string) => {
        try{
            const buffer: Buffer = await sharp(await Bun.file(`images/${fileName}`).arrayBuffer()).webp({
                preset: "picture",
                effort: 6,
                smartSubsample: false,
                quality: 80,
                nearLossless: false,
                lossless: false,
                alphaQuality: 100,
            }).toBuffer()
            const newFileName: string = fileName.replace(/\.[^/.]+$/, "") + ".webp";
            await Bun.file(`output/${newFileName}`).write(buffer);
            console.log(`Converted ${fileName} to ${newFileName}`);
        }catch(e: any){
            console.log("Cannot convert file:", fileName);
        }
    }));
}
