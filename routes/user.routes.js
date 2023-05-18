const { Router } = require("express");
const { check } = require("express-validator");
const {
  userGET,
  userDelete,
  userPOST,
  userPUT,
} = require("../controllers/user.controller");
const {
  validateInputs,
  validateJWT,
  isAdminRole,
  hasRole,
} = require("../middlewares/");

const {} = require("../middlewares/validate-jwt");
const {} = require("../middlewares/validate-role");

const {
  isValidRole,
  emailExists,
  idExists,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", userGET);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    // hasRole("ADMIN", "USER"),
    check("id", "This id is not valid").isMongoId(),
    check("id").custom(idExists),
    validateInputs,
  ],
  userDelete
);

router.post(
  "/",
  [
    check("name", "name is required").notEmpty(),
    check("password", "password need more than 6 characters").isLength({
      min: 6,
    }),
    check("email", "This email is not valid").isEmail(),
    // check("role", "this role is not valid").isIn(["ADMIN", "USER"]),
    check("role").custom(isValidRole),
    check("email").custom(emailExists),
    validateInputs,
  ],
  userPOST
);

router.put(
  "/:id",
  [
    check("id", "This id is not valid").isMongoId(),
    check("id").custom(idExists),
    check("role").custom(isValidRole),
    validateInputs,
  ],
  userPUT
);

module.exports = router;
