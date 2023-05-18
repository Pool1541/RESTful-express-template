const { response, request } = require("express");

const isAdminRole = (req = request, res = response, next) => {
  if (!req.user) {
    return res
      .status(500)
      .json({ message: "we must verify the token before validating the role" });
  }

  const { role, name } = req.user;

  if (role !== "ADMIN") {
    return res
      .status(401)
      .json({ message: `${name} is not authorized for this action` });
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({
          message: `${req.user.name} is not authorized for this action`,
        });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};
