const express = require("express");
const router = express.Router();
const surveyController = require("../controller/surveyController");
const validate = require("../utils/middleware/validate");
const { responseSchema } = require("../utils/validation");


router.post(
  "/api/response",
  validate(responseSchema),
  surveyController.survey
);


module.exports = router;
