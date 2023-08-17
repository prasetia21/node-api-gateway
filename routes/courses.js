const express = require("express");
const router = express.Router();

const coursesHandler = require("./handler/courses");

// handler untuk proteksi endpoint 
const verifyToken = require("../middlewares/verifyToken");
const can = require("../middlewares/permission");

/* Endpoint courses public, bisa diakses siapa saja */
router.get("/", coursesHandler.getAll);
router.get("/:id", coursesHandler.get);

// Endpoint yang diproteksi dengan JWT Token
router.post("/", verifyToken, can('admin'), coursesHandler.create);
router.put("/:id", verifyToken, can('admin'), coursesHandler.update);
router.delete("/:id", verifyToken, can('admin'), coursesHandler.destroy);

module.exports = router;
