const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validateInputs, validateFiles } = require('../middlewares');
const { uploadFile, updateImage } = require('../controllers/uploads.controller');
const { isAllowedCollection } = require('../helpers');

const router = Router();

router.post('/', validateFiles, uploadFile);
router.put(
  '/:collection/:id',
  [
    validateFiles,
    check('id', 'id param is not valid').isMongoId(),
    check('collection').custom((c) => isAllowedCollection(c, ['users', 'products'])),
    validateInputs,
  ],
  updateImage
);

module.exports = router;
