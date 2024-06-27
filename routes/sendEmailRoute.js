const express = require("express");
const { sendEmail } = require("../Controller/sendEmailController.js");
const { auth_middleware } = require("../middleware/verify.js");

const router = express.Router();
router.post("/sendemail", auth_middleware, sendEmail);

module.exports = router;
