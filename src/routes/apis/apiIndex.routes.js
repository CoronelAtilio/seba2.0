const express = require("express");
const router = express.Router();
const path = require('path')

//direcciones de RUTAS
const apiIndexControllers = require(path.resolve(__dirname,"../../controllers/apis/index.js"));

//RUTAS
// http://localhost:4000/api/index/alumnos
router.get('/alumnos',apiIndexControllers.vista_alumnos)
router.get('/profesores',apiIndexControllers.vista_profesores)
router.get('/usuarios',apiIndexControllers.vista_usuarios)


module.exports = router;
