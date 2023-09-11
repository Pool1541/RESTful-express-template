const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth.controller');
const { validateInputs } = require('../middlewares/validate-inputs');

const router = Router();

router.post(
  '/login',
  [
    check('email', 'email is required').isEmail(),
    check('password', ' password is required').notEmpty(),
    validateInputs,
  ],
  login
);

router.post(
  '/google',
  [check('id_token', 'id_token is required').not().isEmpty(), validateInputs],
  googleSignin
);

module.exports = router;
