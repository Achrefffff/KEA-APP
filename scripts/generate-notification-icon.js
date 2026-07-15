const { Jimp } = require('jimp');
const path = require('path');

async function createNotificationIcon() {
  try {
    const inputPath = path.join(__dirname, '../assets/images/KEA_NOIR_SANS_FOND-_3.png');
    const outputPath = path.join(__dirname, '../assets/images/notification-icon.png');

    console.log('📖 Lecture de l\'image de base...');
    const logo = await Jimp.read(inputPath);

    console.log('⚙️ Redimensionnement du logo pour ajouter des marges de sécurité (padding)...');
    // On redimensionne le logo pour qu'il rentre dans un carré de 60x60 (garde le ratio)
    logo.scaleToFit({ w: 60, h: 60 });

    console.log('⚙️ Conversion en monochrome blanc...');
    // Parcourir chaque pixel et rendre blanc tout ce qui n'est pas transparent
    logo.scan(0, 0, logo.bitmap.width, logo.bitmap.height, function (x, y, idx) {
      const alpha = this.bitmap.data[idx + 3];
      if (alpha > 0) {
        this.bitmap.data[idx] = 255;     // Red
        this.bitmap.data[idx + 1] = 255; // Green
        this.bitmap.data[idx + 2] = 255; // Blue
      }
    });

    console.log('⚙️ Création du canvas transparent de 96x96...');
    // Créer un fond transparent de 96x96
    const canvas = new Jimp({ width: 96, height: 96, color: 0x00000000 });

    console.log('⚙️ Centrage du logo sur le canvas...');
    // Centrer le logo sur le canvas transparent de 96x96
    const x = Math.round((96 - logo.bitmap.width) / 2);
    const y = Math.round((96 - logo.bitmap.height) / 2);
    canvas.composite(logo, x, y);

    console.log('💾 Enregistrement de l\'icône de notification...');
    await canvas.write(outputPath);
    console.log('✅ Icône créée avec succès dans assets/images/notification-icon.png !');
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'icône :', error);
  }
}

createNotificationIcon();
