const { Product } = require('../models');

async function validateProduct(id) {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error('El producto no existe');
  }
}

module.exports = {
  validateProduct,
};
