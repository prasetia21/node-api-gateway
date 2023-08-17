const express = require("express");
const router = express.Router();

const refreshTokensHandler = require("./handler/refresh-tokens");

/* Endpoint refreshToken. */
router.post("/", refreshTokensHandler.refreshToken);


module.exports = router;
