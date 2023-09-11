const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/user');
const { generateJWT } = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // TODO verificar si el email existe
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User / password not found' });
    }

    // verificar si el usuario está activo
    if (!user.status) {
      return res.status(404).json({ msg: 'User not activated' });
    }
    // Verificar la contraseña
    const isValidPassword = bcryptjs.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ msg: 'Wrong password' });
    }
    // Genear JWT

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'something went wrong',
    });
  }
};

const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { email, name, img } = await googleVerify(id_token);
    let user = await Usuario.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        img,
        password: '.',
        role: 'USER',
        google: true,
      };

      user = new Usuario(data);
      await user.save();
    }

    if (!user.status) {
      return res.status(401).json({
        msg: 'usuario bloquedo.',
      });
    }

    const token = await generateJWT(user.id);

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: 'Token inválido',
    });
  }
};

module.exports = {
  login,
  googleSignin,
};
