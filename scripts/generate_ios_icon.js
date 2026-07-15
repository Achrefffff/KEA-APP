const Jimp = require('jimp');

async function main() {
  try {
    const fg = await Jimp.read('./assets/images/KEA_NOIR_SANS_FOND-_3.png');
    fg.resize(600, Jimp.AUTO);
    
    // Create new 1024x1024 white image for general/iOS icon
    const out_ios = new Jimp(1024, 1024, 0xFFFFFFFF);
    const x = Math.floor((1024 - fg.bitmap.width) / 2);
    const y = Math.floor((1024 - fg.bitmap.height) / 2);
    
    out_ios.composite(fg, x, y);
    await out_ios.writeAsync('./assets/images/ios_icon.png');
    console.log('Successfully generated iOS icon.');
  } catch (err) {
    console.error(err);
  }
}
main();
