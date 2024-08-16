const express = require("express");
const router = express.Router();
const path = require('path')

const directivoControllers = require(path.resolve(__dirname,"../controllers/directivoControllers"));

//RUTAS

// http://localhost:4000/directivo
router.get("/", directivoControllers.index);

module.exports = router;
