const express = require("express");
const router = express.Router();
const path = require('path')

const preceptorControllers = require(path.resolve(__dirname,"../controllers/preceptorControllers"));

//RUTAS

// http://localhost:4000/preceptor/usuario
router.get("/usuario", preceptorControllers.index);

//CRUD
//RELACIONES
// http://localhost:4000/preceptor/usuario/materiacurso
router.get("/usuario/materiacurso", preceptorControllers.materiaCurso);

// http://localhost:4000/preceptor/usuario/materiacurso
router.post("/usuario/materiacurso", preceptorControllers.unirMateriaCurso);

// http://localhost:4000/preceptor/usuario/materiacursodocente
router.get("/usuario/materiacursodocente", preceptorControllers.MateriaCursoDocente);

// http://localhost:4000/preceptor/usuario/materiacursodocente
router.post("/usuario/materiacursodocente", preceptorControllers.unirMateriaCursoDocente);

// http://localhost:4000/preceptor/usuario/materiacursoalumno
router.get("/usuario/materiacursoalumno", preceptorControllers.MateriaCursoAlumno);

// http://localhost:4000/preceptor/usuario/materiacursoalumno
router.post("/usuario/materiacursoalumno", preceptorControllers.unirMateriaCursoAlumno);

module.exports = router;
