const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { Category, Product, User } = require('../models');
const category = require('../models/category');

const allowedCollections = ['users', 'categories', 'products', 'roles'];

const searchUser = async (keyword = '', res = response) => {
  const isMongoId = isValidObjectId(keyword);

  try {
    if (isMongoId) {
      const [count, user] = await Promise.all([
        User.countDocuments({ _id: keyword, status: true }),
        User.findById(keyword),
      ]);

      return res.json({
        count,
        results: user ? [user] : [],
      });
    }

    const regex = new RegExp(keyword, 'i');

    const [count, users] = await Promise.all([
      User.countDocuments({ $or: [{ name: regex }, { email: regex }], $and: [{ status: true }] }),
      User.find({ $or: [{ name: regex }, { email: regex }], $and: [{ status: true }] }),
    ]);

    console.log(users);

    res.json({
      count,
      results: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Ocurrió un error inesperado',
    });
  }
};

const searchCategory = async (keyword = '', res = response) => {
  const isMongoId = isValidObjectId(keyword);

  try {
    if (isMongoId) {
      const [count, category] = await Promise.all([
        Category.countDocuments({ _id: keyword, state: true }),
        Category.findById(keyword),
      ]);

      return res.status(200).json({
        count,
        results: category ? [category] : [],
      });
    }

    const regex = new RegExp(keyword, 'i');

    const [count, categories] = await Promise.all([
      Category.countDocuments({ name: regex, state: true }),
      Category.find({ name: regex }),
    ]);

    return res.status(200).json({
      count,
      results: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Ocurrió un error inesperado',
    });
  }
};

const searchProduct = async (keyword = '', res = response) => {
  const isMongoId = isValidObjectId(keyword);

  try {
    if (isMongoId) {
      const [count, product] = await Promise.all([
        Product.countDocuments({ _id: keyword, state: true }),
        Product.findById(keyword).populate('category', 'name'),
      ]);

      return res.status(200).json({
        count,
        results: product ? [product] : [],
      });
    }

    const regex = new RegExp(keyword, 'i');

    const [count, products] = await Promise.all([
      Product.countDocuments({ name: regex, state: true }),
      Product.find({ name: regex, state: true }).populate('category', 'name'),
    ]);

    return res.status(200).json({
      count,
      results: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Ocurrió un error inesperado',
    });
  }
};

const search = async (req, res = response) => {
  const { collection, keyword } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      error: `La colleción ${collection} no se encuentra entre las colecciones permitidas para búsquedas.`,
    });
  }

  switch (collection) {
    case 'users':
      searchUser(keyword, res);
      break;
    case 'categories':
      searchCategory(keyword, res);
      break;
    case 'products':
      searchProduct(keyword, res);
      break;

    default:
      res.status(500).json({
        error: 'No se contenpló esta colleción',
      });
  }
};

module.exports = {
  search,
};
