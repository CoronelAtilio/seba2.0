const express = require("express");
const router = express.Router();
const path = require('path')

//direcciones de RUTAS
const adminControllers = require(path.resolve(__dirname,"../controllers/adminControllers"));

//middlewares
const userValidationMiddleware = require(path.resolve(__dirname, "../middlewares/userValidationMiddleware.js"))
const docenteValidationMiddleware = require(path.resolve(__dirname, "../middlewares/docenteValidationMiddleware.js"))
const alu_tutValidationMiddleware = require(path.resolve(__dirname, "../middlewares/alu_tutValidationMiddleware.js"))


//RUTAS
// http://localhost:4000/administrador/usuario
router.get('/usuario',adminControllers.admin)

//CRUD
//CREAR
// http://localhost:4000/administrador/usuario
router.post('/usuario',userValidationMiddleware,adminControllers.crear_usuario)

// http://localhost:4000/administrador/usuario/docente
router.post('/usuario/docente',docenteValidationMiddleware,adminControllers.crear_docente)

// http://localhost:4000/administrador/usuario/alumno
router.post('/usuario/alumno',alu_tutValidationMiddleware,adminControllers.crear_alu_tut)

// http://localhost:4000/administrador/usuario/curso
router.post('/usuario/curso',adminControllers.crear_curso)

// http://localhost:4000/administrador/usuario/materia
router.post('/usuario/materia',adminControllers.crear_materia)


//MODIFICAR
// http://localhost:4000/administrador/usuario/modificar
router.get('/usuario/modificar',adminControllers.modificar)

// http://localhost:4000/administrador/usuario/modificar/tabla
router.post('/usuario/modificar/tabla',adminControllers.modificarTabla)

// http://localhost:4000/administrador/usuario/modificar/relacion
router.post('/usuario/modificar/relacion',adminControllers.modificarRelacion)

//Modificar individual
// http://localhost:4000/administrador/usuario/modificar/:idusuario
router.get('/usuario/modificar/:idusuario',adminControllers.modificarUserOne)

// http://localhost:4000/administrador/usuario/modificar/docente/:idprofesor
router.get('/usuario/modificar/docente/:idprofesor',adminControllers.modificarDocenteOne)

// http://localhost:4000/administrador/usuario/modificar/alumno/:idalumno
router.get('/usuario/modificar/alumno/:idalumno',adminControllers.modificarAlumnoOne)


//Eliminar
// http://localhost:4000/administrador/usuario/modificar/:idusuario
router.post('/usuario/modificar/:idusuario',adminControllers.eliminarUser)

// http://localhost:4000/administrador/usuario/modificar/docente/:idprofesor
router.post('/usuario/modificar/docente/:idprofesor',adminControllers.eliminarDocente)

// http://localhost:4000/administrador/usuario/modificar/alumno/:idalumno
router.post('/usuario/modificar/alumno/:idalumno',adminControllers.eliminarAlumno)

module.exports = router;
