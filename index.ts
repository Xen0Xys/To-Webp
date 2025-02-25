import { readdirSync, statSync } from "fs";
import { join, relative } from "path";
import sharp from "sharp";

const listFilesRecursive = (dir: string, baseDir: string = dir): string[] =>
    readdirSync(dir).flatMap(file => {
        const fullPath: string = join(dir, file);
        return statSync(fullPath).isDirectory() ? listFilesRecursive(fullPath, baseDir) : file !== ".gitkeep" ? [relative(baseDir, fullPath)] : [];
    });

const files: string[] = listFilesRecursive(join(__dirname, "images"));

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
