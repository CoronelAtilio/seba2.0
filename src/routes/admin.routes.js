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


//Modificar individual
// http://localhost:4000/administrador/usuario/modificar/:idusuario
router.get('/usuario/modificar/Usuario/:nuevo_usuario',adminControllers.modificarUserOne)

// http://localhost:4000/administrador/usuario/modificar/docente/:idprofesor
router.get('/usuario/modificar/dni_docente/:dni_docente',adminControllers.modificarDocenteOne)

// http://localhost:4000/administrador/usuario/modificar/dni_alumno/:idalumno
router.get('/usuario/modificar/dni_alumno/:dni_alumno',adminControllers.modificarAlumnoOne)

// http://localhost:4000/administrador/usuario/modificar/idcurso/:idcurso
router.get('/usuario/modificar/idcurso/:idcurso',adminControllers.modificarCursoOne)

// http://localhost:4000/administrador/usuario/modificar/idmateria/:idmateria
router.get('/usuario/modificar/idmateria/:idmateria',adminControllers.modificarMateriaOne)


//Eliminar
// http://localhost:4000/administrador/usuario/modificar/:idusuario
router.post('/usuario/modificar/:idusuario',adminControllers.eliminarUser)

// http://localhost:4000/administrador/usuario/modificar/docente/:idprofesor
router.post('/usuario/modificar/docente/:idprofesor',adminControllers.eliminarDocente)

// http://localhost:4000/administrador/usuario/modificar/alumno/:idalumno
router.post('/usuario/modificar/alumno/:idalumno',adminControllers.eliminarAlumno)

module.exports = router;
