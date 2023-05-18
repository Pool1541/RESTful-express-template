const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(uid);

    if (!user) {
      return res
        .status(401)
        .json({ msg: "Invalid token - user does not exist" });
    }

    // Verificar si el uid tiene el state en true
    if (!user.status) {
      return res.status(401).json({ msg: "Invalid token - inactive user" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = { validateJWT };
