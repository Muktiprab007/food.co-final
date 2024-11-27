const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, 'src/public/heros');
const destination = path.resolve(__dirname, 'src/public/heros');

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, { recursive: true });
}

fs.readdirSync(target)
  .forEach((image) => {
    if (image === 'hero-image_2.jpg') {
      sharp(`${target}/${image}`)
        .resize(480)
        .toFile(path.resolve(destination, 'hero-image_2-small.jpg'));

      sharp(`${target}/${image}`)
        .resize(768)
        .toFile(path.resolve(destination, 'hero-image_2-medium.jpg'));

      sharp(`${target}/${image}`)
        .resize(1600)
        .toFile(path.resolve(destination, 'hero-image_2-large.jpg'));
    }
  });