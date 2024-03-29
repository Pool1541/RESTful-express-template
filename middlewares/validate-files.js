const validateFiles = (req, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({
      error: 'No se seleccionó ningún archivo para subir.',
    });
  }

  next();
};

module.exports = {
  validateFiles,
};
