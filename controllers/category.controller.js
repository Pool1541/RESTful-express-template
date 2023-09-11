const { response } = require('express');
const { Category } = require('../models');

const getAllCategories = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate('user', ['name', 'email', 'role'])
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    categories,
  });
};

const getCategoryById = async (req, res = response) => {
  const { id } = req.params;

  const categoryFromDB = await Category.findById(id).populate('user', ['name', 'email', 'role']);

  if (!categoryFromDB) {
    res.status(404).json({
      message: 'No existe la categoría',
    });
  }

  res.json(categoryFromDB);
};

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      message: 'La categoría ya existe',
    });
  }

  // Generar la data a guardar

  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);
  await category.save();

  res.status(201).json(category);
};

const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  const newName = req.body.newName.toUpperCase();
  const user = req.user._id;

  try {
    const categoryUpdated = await Category.findByIdAndUpdate(
      id,
      { name: newName, user },
      { new: true }
    );

    if (!categoryUpdated) {
      return res.status(404).json({
        error: 'La categoría no existe',
      });
    }

    res.status(200).json({
      message: 'Se actualizó correctamente la categoría',
      category: categoryUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Error al actualizar la categoría',
    });
  }
};

const deleteCategory = async (req, res = response) => {
  const { id } = req.params;

  try {
    const categoryFromDB = await Category.findById(id);

    if (!categoryFromDB.status) {
      return res.status(400).json({
        error: 'La categoría ya fué eliminada previamente',
      });
    }

    await Category.findByIdAndUpdate(id, { state: false });

    // Responder con el codigo http correspondiente y un mensaje en json.
    res.status(200).json({
      message: 'Se eliminó correctamente la categoría',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Error al eliminar la categoría',
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
