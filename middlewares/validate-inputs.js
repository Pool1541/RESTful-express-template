const { validationResult } = require("express-validator");

const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Si hay errores, enviar una respuesta con un código de error 422 y los mensajes de error
    return res.status(400).json(errors);
  }
  next();
};

module.exports = {
  validateInputs,
};
