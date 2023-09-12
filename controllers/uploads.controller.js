const { response } = require('express');
const { validateAndUploadFile } = require('../helpers/upload-file');
const { User, Product } = require('../models');

const uploadFile = async (req, res = response) => {
  try {
    const filename = await validateAndUploadFile(req.files, undefined, 'images');

    res.json({ filename });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

const updateImage = async (req, res = response) => {
  const { id, collection } = req.params;

  try {
    let model;

    switch (collection) {
      case 'users':
        model = await User.findById(id);
        if (!model) return res.status(400).json({ error: 'El usuario no existe' });
        break;
      case 'products':
        model = await Product.findById(id);
        if (!model) return res.status(400).json({ error: 'El producto no existe' });
        break;

      default:
        res.status(500).json({
          error: 'No se implementó esta colleción, error interno.',
        });
    }

    const name = await validateAndUploadFile(req.files, undefined, collection);

    res.json({
      id,
      collection,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({ error });
  }
};

module.exports = {
  uploadFile,
  updateImage,
};
