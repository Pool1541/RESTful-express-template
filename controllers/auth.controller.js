const { response } = require("express");
const { generateJWT } = require("../helpers/generateJWT");
const Usuario = require("../models/user");
const bcryptjs = require("bcryptjs");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // TODO verificar si el email existe
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User / password not found" });
    }

    // verificar si el usuario está activo
    if (!user.status) {
      return res.status(404).json({ msg: "User not activated" });
    }
    // Verificar la contraseña
    const isValidPassword = bcryptjs.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ msg: "Password is not valid" });
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
      msn: "something went wrong",
    });
  }
};

module.exports = {
  login,
};
