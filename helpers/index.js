const dbValidator = require('./db-validators');
const generateJWT = require('./generateJWT');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');
const validatePathName = require('./validate-pathName');

module.exports = {
  ...dbValidator,
  ...generateJWT,
  ...googleVerify,
  ...uploadFile,
  ...validatePathName,
};
