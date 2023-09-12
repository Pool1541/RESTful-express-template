const validateInputs = require('../middlewares/validate-inputs');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-role');
const validateCategory = require('./validate-category');
const validateFiles = require('./validate-files');

module.exports = {
  ...validateInputs,
  ...validateJWT,
  ...validateRoles,
  ...validateCategory,
  ...validateFiles,
};
