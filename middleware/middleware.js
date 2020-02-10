const signToken = require("./signToken");
const validateSignup = require("./validateSignup");
const validateUserId = require("./validateUserId");
const validateTeamId = require("./validateTeamId");
const validateVideoId = require("./validateVideoId");
const validateFeedback = require("./validateFeedback");
const validateTeamData = require("./validateTeamData");

module.exports = {
  signToken,
  validateUserId,
  validateSignup,
  validateTeamId,
  validateVideoId,
  validateFeedback,
  validateTeamData,
};
