const { response, request } = require('express');
const { Category } = require('../models');

const validateCategory = async (req = request, res = response, next) => {
  const category = req.body.category.toUpperCase();

  const categoryFromDB = await Category.findOne({ name: category });
  if (!categoryFromDB) {
    return res.status(400).json({
      error: 'La categoría no existe',
    });
  }

  req.category = categoryFromDB;

  next();
};

module.exports = { validateCategory };
