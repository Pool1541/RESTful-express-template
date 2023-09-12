const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async (role = '') => {
  const rolExists = await Role.findOne({ role });
  if (!rolExists) {
    throw new Error(`The ${role} role is not registerd in the database`);
  }
};

const emailExists = async (email = '') => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error(`${email} already exists`);
  }
};

const idExists = async (id = '') => {
  const idExists = await User.findById(id);
  if (!idExists) {
    throw new Error(`${id} does not exists`);
  }
};

// Validar colecciones permitidas
const isAllowedCollection = (collection = '', allowedCollections = []) => {
  const include = allowedCollections.includes(collection);

  if (!include)
    throw new Error(
      `La colección ${collection} no está incluida entre las colecciones válidas: ${allowedCollections}`
    );

  return true;
};

module.exports = {
  isValidRole,
  emailExists,
  idExists,
  isAllowedCollection,
};
