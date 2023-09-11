const { Router } = require('express');
const { check } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller');
const { validateJWT, validateInputs, validateCategory, hasRole } = require('../middlewares');
const { validateProduct } = require('../helpers/validateProduct');

const router = Router();

router.get('/', getProducts);

router.get(
  '/:id',
  [check('id', 'id param is not valid').isMongoId(), validateInputs],
  getProductById
);

router.post(
  '/',
  [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    validateInputs,
    validateCategory,
  ],
  createProduct
);

router.put('/:id', [validateJWT, check('id', 'id param is not valid').isMongoId()], updateProduct);

router.delete(
  '/:id',
  [
    validateJWT,
    hasRole('ADMIN'),
    check('id', 'id param is not valida').isMongoId(),
    check('id').custom(validateProduct),
    validateInputs,
  ],
  deleteProduct
);

module.exports = router;
