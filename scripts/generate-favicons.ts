import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const publicDir = path.join(process.cwd(), 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

// Read the exact favicon.svg from /public
const svgContent = fs.readFileSync(svgPath, 'utf-8');

async function generate() {
  console.log('Reading exact favicon.svg from /public...');

  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ];

  const generatedPngBuffers: Record<number, Buffer> = {};

  for (const item of sizes) {
    const resvg = new Resvg(svgContent, {
      fitTo: {
        mode: 'width',
        value: item.size,
      },
      shapeRendering: 2, // geometricPrecision
      textRendering: 2,
      imageRendering: 0,
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    
    fs.writeFileSync(path.join(publicDir, item.name), pngBuffer);
    generatedPngBuffers[item.size] = pngBuffer;
    console.log(`Generated valid standard PNG: ${item.name} (${item.size}x${item.size})`);
  }

  // Generate real multi-size .ico containing 16x16, 32x32, 48x48
  const icoBuffer = await pngToIco([
    path.join(publicDir, 'favicon-16x16.png'),
    path.join(publicDir, 'favicon-32x32.png'),
    path.join(publicDir, 'favicon-48x48.png'),
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated valid multi-size favicon.ico (containing 16x16, 32x32, 48x48)');
}

generate()
  .then(() => {
    console.log('All favicons regenerated successfully.');
  })
  .catch((err) => {
    console.error('Generation error:', err);
    process.exit(1);
  });
