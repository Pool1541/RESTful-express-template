const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT, validateInputs, hasRole } = require('../middlewares');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

const router = Router();

// Obtener todas las categorías. - público
router.get('/', getAllCategories);

// Obtener una categoría por id. - público
router.get('/:id', [check('id', 'id is not valid').isMongoId(), validateInputs], getCategoryById);

// Crear categoría - privado - cualquier persona con jwt válido
router.post(
  '/',
  [validateJWT, check('name', 'name is required').not().isEmpty(), validateInputs],
  createCategory
);

// Actualizar una categoría por id - privado - cualquier persona con jwt válido
router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'id is not valid').isMongoId(),
    check('newName', 'name is required').not().isEmpty(),
    validateInputs,
  ],
  updateCategory
);

// Borrar una categoría - Admin
router.delete(
  '/:id',
  [validateJWT, hasRole('ADMIN'), check('id', 'id is not valid').isMongoId(), validateInputs],
  deleteCategory
);

module.exports = router;
