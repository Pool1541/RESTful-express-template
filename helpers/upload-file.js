const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { validateAndCreatePath } = require('./validate-pathName');

const validateAndUploadFile = (
  files,
  validExtensions = ['png', 'jpeg', 'jpg', 'gif'],
  folderName = ''
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const fileName = file.name.split('.');

    // Validar la extensión
    const extension = fileName.at(-1);

    if (!validExtensions.includes(extension)) {
      return reject(`El archivo debe tener una extensión válida: ${validExtensions}`);
    }

    // Crear un nombre único para el archivo
    const tempName = uuidv4() + '.' + extension;
    const absolutePath = validateAndCreatePath('../uploads/');
    const uploadPath = path.join(absolutePath, folderName, tempName);

    file.mv(uploadPath, (error) => {
      if (error) {
        reject(error);
      }

      resolve(tempName);
    });
  });
};

module.exports = {
  validateAndUploadFile,
};
