import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

async function convertSvgToPng() {
    const sizes = [192, 512];
    
    for (const size of sizes) {
        const svgPath = path.resolve(`public/pwa-${size}x${size}.svg`);
        const pngPath = path.resolve(`public/pwa-${size}x${size}.png`);
        
        const svgBuffer = await fs.readFile(svgPath);
        
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(pngPath);
            
        console.log(`Converted ${size}x${size} icon to PNG`);
    }
}

convertSvgToPng().catch(console.error);
