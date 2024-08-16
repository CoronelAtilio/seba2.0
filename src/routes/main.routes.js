const express = require("express");
const router = express.Router();
const path = require('path')

//Importaciones
const indexControllers = require(path.resolve(__dirname,"../controllers/indexControllers"));
const loginValidationMiddleware = require(path.resolve(__dirname,"../middlewares/loginValidationMiddleware"))
const notLoggedMiddleware = require(path.resolve(__dirname,'../middlewares/notLoggedMiddleware'))
const yesLoggedMiddleware = require(path.resolve(__dirname,'../middlewares/yesLoggedMiddleware'))

//RUTAS

// http://localhost:4000/
router.get("/",yesLoggedMiddleware, indexControllers.acceso)
router.post("/", loginValidationMiddleware,indexControllers.accesoVerificacion)

// http://localhost:4000/welcome
router.get("/welcome",notLoggedMiddleware,indexControllers.bienvenida)
router.get("/welcome/buscar",notLoggedMiddleware, indexControllers.bienvenidaSearch)

// http://localhost:4000/logout
router.get("/logout",notLoggedMiddleware,indexControllers.logout)

module.exports = router;
