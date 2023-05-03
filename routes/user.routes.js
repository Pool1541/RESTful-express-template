const { Router } = require("express");
const {
  userGET,
  userDelete,
  userPOST,
  userPUT,
} = require("../controllers/user.controller");

const router = Router();

router.get("/", userGET);

router.delete("/", userDelete);

router.post("/", userPOST);

router.put("/:id", userPUT);

module.exports = router;
