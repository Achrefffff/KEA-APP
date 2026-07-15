const { Jimp } = require('jimp');
const path = require('path');

async function createNotificationIcon() {
  try {
    const inputPath = path.join(__dirname, '../assets/images/KEA_NOIR_SANS_FOND-_3.png');
    const outputPath = path.join(__dirname, '../assets/images/notification-icon.png');

    console.log('📖 Lecture de l\'image de base...');
    const image = await Jimp.read(inputPath);

    console.log('⚙️ Conversion en monochrome blanc (avec fond transparent)...');
    
    // Parcourir chaque pixel et rendre blanc tout ce qui n'est pas transparent
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const alpha = this.bitmap.data[idx + 3];
      if (alpha > 0) {
        // Rendre le pixel blanc (RGB = 255, 255, 255)
        this.bitmap.data[idx] = 255;     // Red
        this.bitmap.data[idx + 1] = 255; // Green
        this.bitmap.data[idx + 2] = 255; // Blue
      }
    });

    console.log('💾 Enregistrement de l\'icône de notification...');
    await image.write(outputPath);
    console.log('✅ Icône créée avec succès dans assets/images/notification-icon.png !');
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'icône :', error);
  }
}

createNotificationIcon();
