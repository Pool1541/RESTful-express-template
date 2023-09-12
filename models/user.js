const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'The name attribute is required'],
  },
  email: {
    type: String,
    required: [true, 'The email attribute is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'The password attribute is required'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: [true, 'The role attribute is required'],
    enum: ['ADMIN', 'USER'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  img: { type: String },
});

UserSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model('User', UserSchema);
