"use strict";
const responseHandler = require("../utils/customResponse");
const surveyService = require("../services/survey.service");

module.exports = {
  

   survey: async (req, res) => {
    try {
      const response = await surveyService.survey(
        req.body
      );

      if (!response.success) {
        return responseHandler.error(
          res,
          { success: response.success, message: response.message },
          400
        );
      }

      return responseHandler.success(res, {
        success: response.success,
        message: response.message,
        data: response.data
      });
    } catch (error) {
      return responseHandler.error(
        res,
        { success: false, message: "Internal Server Error" },
        500
      );
    }
  },

};


