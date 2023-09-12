const path = require('path');
const { v4: uuidv4 } = require('uuid');

const validateAndUploadFile = (
  files,
  validExtensions = ['png', 'jpeg', 'jpg', 'gif'],
  pathName = ''
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
    const uploadPath = path.join(__dirname, '../uploads/', pathName, tempName);
    console.log(uploadPath);

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
