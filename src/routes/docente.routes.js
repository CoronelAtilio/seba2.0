const express = require("express");
const router = express.Router();
const path = require('path')

const docenteControllers = require(path.resolve(__dirname,"../controllers/docenteControllers"));

//RUTAS

// http://localhost:4000/docente
router.get("/", docenteControllers.index);

router.post("/", docenteControllers.cursoSelected);

// http://localhost:4000/docente/:id
router.post("/nota", docenteControllers.nota_alu);

module.exports = router;
