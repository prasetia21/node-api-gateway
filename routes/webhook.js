const express = require("express");
const router = express.Router();

const webhookHandler = require("./handler/webhook");

/* Endpoint webhook. */
router.post("/", webhookHandler.webhook);

module.exports = router;
