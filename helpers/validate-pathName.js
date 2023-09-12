const { existsSync, mkdirSync } = require('fs');
const path = require('path');

function validateAndCreatePath(pathName = '') {
  if (!pathName) throw new Error('Especifique una ruta.');

  const absolutePath = path.join(__dirname, pathName);
  if (!existsSync(absolutePath)) {
    mkdirSync(absolutePath);
  }

  return absolutePath;
}

module.exports = { validateAndCreatePath };
