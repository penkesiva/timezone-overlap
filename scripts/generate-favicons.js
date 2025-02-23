const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const pngToIco = require('png-to-ico');

const sizes = {
  favicon: [16, 32, 48],
  apple: [180],
  android: [192, 512],
};

async function generateFavicons() {
  const inputSvg = await fs.readFile(path.join(__dirname, '../public/favicon.svg'));
  
  // Generate PNG files for ICO conversion
  const pngBuffers = await Promise.all(
    sizes.favicon.map(size => 
      sharp(inputSvg)
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );

  // Create ICO file from PNGs
  const icoBuffer = await pngToIco(pngBuffers);
  
  // Save favicon.ico in both app and public directories
  await fs.writeFile(path.join(__dirname, '../app/favicon.ico'), icoBuffer);
  await fs.writeFile(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
  
  // Generate Apple Touch Icon
  await sharp(inputSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
  
  // Generate Android Chrome icons
  await sharp(inputSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '../public/android-chrome-192x192.png'));
  
  await sharp(inputSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../public/android-chrome-512x512.png'));
  
  // Generate Safari Pinned Tab SVG (black and white version)
  const safariSvg = inputSvg.toString()
    .replace(/#4A90E2/g, '#000000')
    .replace(/#F6AD55/g, '#000000')
    .replace(/#1a1a1a/g, '#ffffff');
  
  await fs.writeFile(
    path.join(__dirname, '../public/safari-pinned-tab.svg'),
    safariSvg
  );
  
  console.log('All favicon files generated successfully!');
}

generateFavicons().catch(console.error); 