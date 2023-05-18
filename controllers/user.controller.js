// Para facilitar el tipado
const { response, request } = require("express");

const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const userGET = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  // Codigo bloqueante
  // const count = await User.countDocuments(query);
  // const users = await User.find(query).skip(Number(from)).limit(Number(limit));

  const [count, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    count,
    users,
  });
};

const userPOST = async (req = request, res = response) => {
  const { name, email, password, role, img } = req.body;
  const user = new User({ name, email, password, role, img });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Guardar en DB
  await user.save();

  res.json(user);
};

const userDelete = async (req, res = response) => {
  const { id } = req.params;

  // Borramos el usuario fisicamente de la base de datos
  // const user = await User.findByIdAndDelete(id);

  // En su lugar cambiamos el estado a false para indicar que ese usuario está desactivado y mantener la integridad de sus datos.
  const user = await User.findByIdAndUpdate(id, { status: false });

  res.json({
    user,
  });
};

const userPUT = async (req, res = response) => {
  const { id } = req.params;
  const { google, status, password, email, ...paramsOfUser } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    paramsOfUser.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, paramsOfUser);

  res.json(user);
};

module.exports = {
  userGET,
  userPOST,
  userDelete,
  userPUT,
};
