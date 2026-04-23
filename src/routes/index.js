const express = require("express");
const router = express.Router();
const surveyController = require("../controller/surveyController");
const validate = require("../utils/middleware/validate");
const { responseSchema } = require("../utils/validation");
const { responseLimiter } = require("../utils/rateLimter");


router.post(
  "/api/response",
  responseLimiter,
  validate(responseSchema),
  surveyController.survey
);


module.exports = router;
