const { response } = require('express');
const { Product } = require('../models');

const getProducts = async (req, res = response) => {
  const { limit = 10, from = 0 } = req.query;
  const query = { state: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('user', 'name')
      .populate('category', 'name')
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    products,
  });
};

const getProductById = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate('user', 'name').populate('category', 'name');

  if (!Product) {
    return res.status(404).json({
      error: 'El producto no existe',
    });
  }

  res.status(200).json({
    product,
  });
};

const createProduct = async (req, res = response) => {
  const { price, description } = req.body;
  const name = req.body.name.toUpperCase();

  const productFromDB = await Product.findOne({ name });
  if (productFromDB) {
    return res.status(400).json({
      error: 'El producto ya existe',
    });
  }

  const data = {
    name,
    price,
    description,
    category: req.category._id,
    user: req.user._id,
  };

  const product = new Product(data);

  await product.save();

  res.status(200).json({
    message: 'El producto se ha creado correctamente',
    product,
  });
};

const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { price, description, available } = req.body;
  const user = req.user._id;

  try {
    const productUpdated = await Product.findByIdAndUpdate(
      id,
      { price, description, available, user },
      { new: true }
    );

    // Verificar si existe usando el validador custom de express-validator
    if (!productUpdated) {
      return res.status(404).json({
        error: 'El id de producto no existe',
      });
    }

    res.json({
      message: 'Se actualizó el producto correctamente',
      product: productUpdated,
    });
  } catch (error) {}
};

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product.state)
      return res.status(400).json({
        error: 'El producto ya ha sido eliminado previamente',
      });

    await Product.findByIdAndUpdate(id, { state: false });

    res.json({
      message: 'El producto se ha eliminado correctamente',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Ocurrió un error inesperado',
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
