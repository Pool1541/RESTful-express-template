// Para facilitar el tipado
const { response, request } = require("express");

const userGET = (req, res = response) => {
  const { page = 1, limit = 10, APIKEY } = req.query;
  res.status(200).json({
    type: `${__dirname} GET from controller`,
    page,
    limit,
    APIKEY,
  });
};

const userPOST = (req = request, res = response) => {
  const { username, couple } = req.body;

  res.json({
    type: "post from controller",
    username,
    couple,
  });
};

const userDelete = (req, res = response) => {
  res.json({
    type: "delete from controller",
  });
};

const userPUT = (req, res = response) => {
  const { id } = req.params;
  res.json({
    type: "Put from controller",
    id,
  });
};

module.exports = {
  userGET,
  userPOST,
  userDelete,
  userPUT,
};
