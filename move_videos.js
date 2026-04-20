const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const srcDir = path.join(projectRoot, 'entrevistaaenrique');
const publicDir = path.join(projectRoot, 'public');
const destDir = path.join(publicDir, 'entrevistaaenrique');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

if (fs.existsSync(srcDir)) {
  fs.renameSync(srcDir, destDir);
  console.log('Carpeta movida exitosamente a public/entrevistaaenrique');
} else if (fs.existsSync(destDir)) {
  console.log('La carpeta ya se encuentra en public/entrevistaaenrique');
} else {
  console.log('No se encontro la carpeta entrevistaraenrique en la raiz');
}
