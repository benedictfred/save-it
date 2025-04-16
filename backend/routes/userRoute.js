const express = require("express");
const router = express.Router();
const {
  getRecipientPhoneNumber,
  getUserById,
  setOrPutPin,
  transferMoney,
} = require("../controllers/userController");

router.get("/recipient/:phoneNumber", getRecipientPhoneNumber);
router.get("/:id", getUserById);
router.post("/pin", setOrPutPin);
router.post("/transfer", transferMoney);

module.exports = router;
