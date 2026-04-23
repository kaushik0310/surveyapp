"use strict";
const ResponseModel = require("../models/SurveyResponse")

class SurveyService {
  constructor() {
    this.ResponseModel = ResponseModel;
  }

   async survey(reqObj) {
    try {
          
          const createdSurvey = await this.ResponseModel.create(reqObj)
      
      return {
        success: true,
        message: "survey created successfully",
        data: createdSurvey
      };

    } catch (error) {
      console.log("error",error)
      return { success: false, message: "Internal server error", statusCode: 500 };
    }
  }

}

module.exports = new SurveyService();
