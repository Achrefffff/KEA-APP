const Jimp = require('jimp');

async function main() {
  try {
    const fg = await Jimp.read('./assets/images/KEA_NOIR_SANS_FOND-_3.png');
    // scale up by width (keeping aspect ratio)
    fg.resize(600, Jimp.AUTO);
    
    // Create new 1024x1024 transparent image
    const out = new Jimp(1024, 1024, 0x00000000);
    
    const x = Math.floor((1024 - fg.bitmap.width) / 2);
    const y = Math.floor((1024 - fg.bitmap.height) / 2);
    
    out.composite(fg, x, y);
    await out.writeAsync('./assets/images/KEA_adaptive_foreground.png');
    console.log('Successfully generated adaptive icon foreground.');
  } catch (err) {
    console.error(err);
  }
}
main();
