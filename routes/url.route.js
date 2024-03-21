const express = require("express");
const { create, redirect, validate } = require("../controllers/url.controller");

const router = express.Router();

router.get("/shorturl/:short_url", redirect);

router.post("/shorturl", validate, create);

module.exports = router;
