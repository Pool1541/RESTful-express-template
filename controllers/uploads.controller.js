const { response } = require('express');
const { existsSync, unlinkSync } = require('fs');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const { validateAndUploadFile } = require('../helpers/upload-file');
const { User, Product } = require('../models');

cloudinary.config(process.env.CLOUDINARY_URL);

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

    // Limpiar imágenes previas.

    if (model.img) {
      // Verificamos si existe la imagen en el servidor y la borramos
      const pathImage = path.join(__dirname, '../uploads', collection, model.img);
      existsSync(pathImage) && unlinkSync(pathImage);
    }

    const name = await validateAndUploadFile(req.files, undefined, collection);
    model.img = name;

    await model.save();

    res.json({
      name,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({ error });
  }
};

const updateImageCloudinary = async (req, res = response) => {
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

    // Limpiar imágenes previas.
    if (model.img) {
      // Verificamos si existe la imagen en el servidor de cloudinary y la borramos
      const [publicId] = model.img.split('/').at(-1).split('.');
      cloudinary.uploader.destroy(publicId);
    }

    // Cargamos la imagen a claudinary
    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;

    // Guardamos la url segura en la base de datos
    await model.save();

    res.json({
      model,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({ error });
  }
};

const sendImage = async (req, res = response) => {
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

    // Limpiar imágenes previas.

    if (model.img) {
      // Verificamos si existe la imagen en el servidor y la borramos
      const pathImage = path.join(__dirname, '../uploads', collection, model.img);

      if (existsSync(pathImage)) {
        return res.sendFile(pathImage);
      }
    }

    const noImagePath = path.join(__dirname, '../assets', 'no-image.jpg');

    res.sendFile(noImagePath);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = {
  uploadFile,
  updateImage,
  sendImage,
  updateImageCloudinary,
};
