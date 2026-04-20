const fs = require('fs');
const path = require('path');

const srcProject = 'c:/Users/Andry/Documents/trae_projects/lindasal';
const destProject = 'c:/Users/Andry/Documents/trae_projects/lindasalnuevo';

// copy images
const imgSrc = path.join(srcProject, 'imagen de fondo');
const imgDest = path.join(destProject, 'public', 'images');
if (!fs.existsSync(imgDest)) fs.mkdirSync(imgDest, {recursive: true});

if (fs.existsSync(imgSrc)) {
  fs.readdirSync(imgSrc).forEach(file => {
    fs.copyFileSync(path.join(imgSrc, file), path.join(imgDest, file));
  });
  console.log("Images copied.");
}

// copy css
const cssSrc = path.join(srcProject, 'css');
const cssDest = path.join(destProject, 'src', 'app', 'css');
if (!fs.existsSync(cssDest)) fs.mkdirSync(cssDest, {recursive: true});

if (fs.existsSync(cssSrc)) {
  fs.readdirSync(cssSrc).forEach(file => {
    fs.copyFileSync(path.join(cssSrc, file), path.join(cssDest, file));
  });
  console.log("CSS copied.");
}
