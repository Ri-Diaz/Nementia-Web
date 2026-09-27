import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();

const sourceDir = path.join(
  rootDir,
  'public',
  'images'
);

// La carpeta optimizada queda FUERA del repositorio
const outputDir = path.resolve(
  rootDir,
  '..',
  'Nementia-Web-Imagenes-Optimizadas'
);


// ======================================================
// CONFIGURACIÓN DE IMÁGENES
// ======================================================

const images = [

  // ----------------------------------------------------
  // HERO
  // máximo 2400 px de ancho
  // ----------------------------------------------------

  {
    name: 'vita-est-in-morte-hero.jpg',
    width: 2400
  },


  // ----------------------------------------------------
  // BANNERS
  // máximo 2400 px de ancho
  // ----------------------------------------------------

  {
    name: 'banner1.jpg',
    width: 2400
  },

  {
    name: 'banner2.jpg',
    width: 2400
  },

  {
    name: 'banner4.jpg',
    width: 2400
  },

  {
    name: 'banner5.jpeg',
    width: 2400
  },

  {
    name: 'banner6.jpg',
    width: 2400
  },


  // ----------------------------------------------------
  // FOTOGRAFÍAS
  // máximo 2000 px por lado
  // ----------------------------------------------------

  ...Array.from(
    { length: 15 },
    (_, i) => ({
      name: `foto-${String(i + 1).padStart(2, '0')}.jpg`,
      width: 2000,
      height: 2000
    })
  ),


  // ----------------------------------------------------
  // ILUSTRACIONES
  // máximo 1800 px por lado
  // ----------------------------------------------------

  {
    name: '1-nementia.jpeg',
    width: 1800,
    height: 1800
  },

  {
    name: '2-dryas.jpeg',
    width: 1800,
    height: 1800
  },

  {
    name: '3-inerte.jpeg',
    width: 1800,
    height: 1800
  },

  {
    name: '4-irreflejo.jpeg',
    width: 1800,
    height: 1800
  },

  {
    name: '5-paro.jpg',
    width: 1800,
    height: 1800
  },

  {
    name: '6-menguante.jpg',
    width: 1800,
    height: 1800
  },

  {
    name: '7-nodus-tollens.jpeg',
    width: 1800,
    height: 1800
  },

  {
    name: '8-snag.jpg',
    width: 1800,
    height: 1800
  },


  // ----------------------------------------------------
  // BIO
  // máximo 2000 px por lado
  // ----------------------------------------------------

  {
    name: 'bio-principal.jpg',
    width: 2000,
    height: 2000
  },

  {
    name: 'bio-sesion-01.jpg',
    width: 2000,
    height: 2000
  },

  {
    name: 'bio-sesion-02.jpg',
    width: 2000,
    height: 2000
  },


  // ----------------------------------------------------
  // CARÁTULAS
  // máximo 1600 px por lado
  // ----------------------------------------------------

  {
    name: 'vita-est-in-morte-cover.jpg',
    width: 1600,
    height: 1600
  },

  {
    name: 'dryas.jpg',
    width: 1600,
    height: 1600
  },

  {
    name: 'nementia-single.jpg',
    width: 1600,
    height: 1600
  }

];


// ======================================================
// UTILIDADES
// ======================================================

function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}


// ======================================================
// PROCESAMIENTO
// ======================================================

await fs.mkdir(
  outputDir,
  { recursive: true }
);

console.log('');
console.log('==============================================');
console.log(' OPTIMIZACIÓN DE IMÁGENES - NEMENTIA');
console.log('==============================================');
console.log('');

console.log(`Origen:  ${sourceDir}`);
console.log(`Destino: ${outputDir}`);
console.log('');


let originalTotal = 0;
let optimizedTotal = 0;
let processed = 0;
let errors = 0;


for (const config of images) {

  const inputPath = path.join(
    sourceDir,
    config.name
  );

  const outputPath = path.join(
    outputDir,
    config.name
  );

  try {

    const originalStats = await fs.stat(inputPath);

    const originalSize =
      originalStats.size;

    originalTotal += originalSize;


    // Obtener datos originales
    const metadata =
      await sharp(inputPath).metadata();


    // Procesamiento
    await sharp(inputPath)

      // Corrige automáticamente orientación EXIF
      .rotate()

      // Redimensiona sin deformar ni ampliar
      .resize({
        width: config.width,
        height: config.height,
        fit: 'inside',
        withoutEnlargement: true
      })

      // JPEG optimizado para web
      .jpeg({
        quality: 84,
        progressive: true,
        mozjpeg: true
      })

      .toFile(outputPath);


    const optimizedStats =
      await fs.stat(outputPath);

    const optimizedSize =
      optimizedStats.size;

    optimizedTotal += optimizedSize;


    const optimizedMetadata =
      await sharp(outputPath).metadata();


    const reduction =
      (
        100 -
        (
          optimizedSize /
          originalSize *
          100
        )
      ).toFixed(1);


    console.log(
      `${config.name}`
    );

    console.log(
      `  ${metadata.width}x${metadata.height}`
      +
      `  →  `
      +
      `${optimizedMetadata.width}x${optimizedMetadata.height}`
    );

    console.log(
      `  ${formatMB(originalSize)} MB`
      +
      `  →  `
      +
      `${formatMB(optimizedSize)} MB`
      +
      `  (${reduction}% menos)`
    );

    console.log('');

    processed++;

  }

  catch (error) {

    console.error(
      `ERROR: ${config.name}`
    );

    console.error(
      `  ${error.message}`
    );

    console.log('');

    errors++;

  }

}


// ======================================================
// RESUMEN
// ======================================================

const totalReduction =
  originalTotal > 0
    ? (
        100 -
        (
          optimizedTotal /
          originalTotal *
          100
        )
      ).toFixed(1)
    : 0;


console.log('==============================================');
console.log(' RESUMEN');
console.log('==============================================');

console.log(
  `Procesadas: ${processed}`
);

console.log(
  `Errores: ${errors}`
);

console.log(
  `Original:   ${formatMB(originalTotal)} MB`
);

console.log(
  `Optimizado: ${formatMB(optimizedTotal)} MB`
);

console.log(
  `Reducción:  ${totalReduction}%`
);

console.log('');

console.log(
  'Las imágenes originales NO fueron modificadas.'
);

console.log(
  `Las versiones optimizadas están en:`
);

console.log(
  outputDir
);

console.log('');