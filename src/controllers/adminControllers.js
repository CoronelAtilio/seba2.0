const db = require('../database/models')
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
const { Op, where } = require('sequelize');


module.exports = {
    admin: (req, res) => {
        res.render('admin/usuario')
    },
    crear_usuario: async (req, res) => {
        const actionType = req.body.actionType;

        if (actionType === 'crear') {
            try {
                // Validación de errores
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.render('admin/usuario', {
                        errors1: errors.mapped(),
                        old1: req.body,
                        activeForm: 'form1'
                    });
                }

                let { nombre_usuario, password_usuario, password_usuario2, permisos, dni_docente } = req.body;
                let errorsObj = {};

                // Verificación de contraseñas
                if (password_usuario !== password_usuario2) {
                    errorsObj.password_usuario2 = { msg: 'No Coinciden Contraseñas' };
                }

                // Verificación de existencia de usuario
                const usuarioExistente = await db.Usuario.findOne({
                    where: { nombre_usuario }
                });

                if (usuarioExistente) {
                    errorsObj.nombre_usuario = { msg: 'Este usuario ya Existe' };
                }

                // Verificación de existencia de docente
                const docenteExistente = await db.Docente.findOne({
                    where: { dni_docente }
                });

                if (!docenteExistente) {
                    errorsObj.dni_docente = { msg: 'Este Docente no existe. Primero crea el docente' };
                }

                if (Object.keys(errorsObj).length > 0) {
                    return res.render('admin/usuario', {
                        errors1: errorsObj,
                        old1: req.body,
                        activeForm: 'form1'
                    });
                }

                // Promesas para buscar el rol y hashear la contraseña
                const rolPromise = db.Rol.findOne({ where: { nombre_rol: permisos.toLowerCase() } });
                const hashedPasswordPromise = bcrypt.hash(password_usuario, 10);

                // Esperar a que las promesas se resuelvan
                const [rol, hashedPassword] = await Promise.all([rolPromise, hashedPasswordPromise]);

                // Verificación de existencia de rol
                if (!rol) {
                    errorsObj.permisos = { msg: 'Rol no encontrado' };
                    return res.render('admin/usuario', {
                        errors1: errorsObj,
                        old1: req.body,
                        activeForm: 'form1'
                    });
                }

                // Crear el usuario
                await db.Usuario.create({
                    nombre_usuario,
                    password_usuario: hashedPassword,
                    fk_idrol_usuario: rol.idrol,
                    fk_iddocente_usuario: docenteExistente.iddocente,
                    estado_usuario: 1
                });

                // Redirección tras la creación exitosa
                res.redirect('/administrador/usuario');

            } catch (error) {
                console.error("Error al crear el usuario:", error);
                res.status(500).send('Ocurrió un error al crear el usuario.');
            }
        } else if (actionType === 'modificar') {
            try {
                // Validar errores en la solicitud
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.render('admin/usuario', {
                        errors1: errors.mapped(),
                        old1: req.body,
                        activeForm: 'form1'
                    });
                }

                let { nombre_usuario, password_usuario, password_usuario2, permisos, dni_docente } = req.body;
                let errorsObj = {};

                // Verificación de existencia de usuario actual
                const usuarioActual = await db.Usuario.findOne({
                    where: { nombre_usuario }
                });

                if (!usuarioActual) {
                    errorsObj.nombre_usuario = { msg: 'Usuario no encontrado' };
                    return res.render('admin/usuario', {
                        errors1: errorsObj,
                        old1: req.body,
                        activeForm: 'form1'
                    });
                }

                // Verificación de contraseñas
                if (password_usuario !== password_usuario2) {
                    errorsObj.password_usuario2 = { msg: 'No Coinciden Contraseñas' };
                }

                // Verificación de existencia de docente
                const docenteExistente = await db.Docente.findOne({
                    where: { dni_docente }
                });

                if (!docenteExistente) {
                    errorsObj.dni_docente = { msg: 'Este Docente no existe. Primero crea el docente' };
                }

                if (Object.keys(errorsObj).length > 0) {
                    return res.render('admin/usuario', {
                        errors1: errorsObj,
                        old1: req.body,
                        activeForm: 'form1'
                    });
                }

                // Buscar el rol y hashear la nueva contraseña (si es que se cambia)
                const rol = await db.Rol.findOne({ where: { nombre_rol: permisos.toLowerCase() } });
                let hashedPassword = usuarioActual.password_usuario;
                if (password_usuario) {
                    hashedPassword = await bcrypt.hash(password_usuario, 10);
                }

                if (!rol) {
                    errorsObj.permisos = { msg: 'Rol no encontrado' };
                    return res.render('admin/usuario', {
                        errors1: errorsObj,
                        old1: req.body,
                        activeForm: 'form1'
                    });
                }

                // Actualizar el usuario
                await db.Usuario.update(
                    {
                        nombre_usuario,
                        password_usuario: hashedPassword,
                        fk_idrol_usuario: rol.idrol,
                        fk_iddocente_usuario: docenteExistente.iddocente,
                        estado_usuario: 1
                    },
                    { where: { idusuario: usuarioActual.idusuario } }
                );

                // Redirección tras la modificación exitosa
                res.redirect('/administrador/usuario');

            } catch (error) {
                console.error("Error al modificar el usuario:", error);
                res.status(500).send('Ocurrió un error al modificar el usuario.');
            }
        }
    },
    crear_docente: async (req, res) => {
        const actionType = req.body.actionType;

        if (actionType === 'crear') {
            // Lógica para crear el alumno
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.render('admin/usuario', {
                        errors2: errors.mapped(),
                        old2: req.body,
                        activeForm: 'form2'
                    });
                }

                let { apellido_docente, nombre_docente, fecha_nac_docente, email_docente, celular_docente, nombre_cargo, dni_docente, condicion } = req.body;
                email_docente = email_docente.toLowerCase();
                let errorsObj = {};

                const docenteExistente = await db.Docente.findOne({
                    attributes: ['dni_docente', 'email_docente', 'celular_docente'],
                    where: {
                        [Op.or]: [
                            { dni_docente: dni_docente },
                            { email_docente: email_docente },
                            { celular_docente: celular_docente }
                        ]
                    }
                });

                // Verificar campos únicos
                if (docenteExistente) {
                    if (docenteExistente.dni_docente === dni_docente) {
                        errorsObj.dni_docente = { msg: 'Este DNI ya existe' };
                    }
                    if (docenteExistente.email_docente === email_docente) {
                        errorsObj.email_docente = { msg: 'Este Email ya Existe' };
                    }
                    if (docenteExistente.celular_docente === celular_docente) {
                        errorsObj.celular_docente = { msg: 'Este Celular ya Existe' };
                    }
                }

                if (Object.keys(errorsObj).length > 0) {
                    return res.render('admin/usuario', {
                        errors2: errorsObj,
                        old2: req.body,
                        activeForm: 'form2'
                    });
                }

                // Promesas para buscar cargo, situación y materia
                const cargoPromise = db.Cargo.findOne({ where: { nombre_cargo } });
                const situacionPromise = db.Situacion.findOne({ where: { nombre_situacion: condicion } });

                // Esperar a que todas las promesas se resuelvan
                const [cargo, situacion] = await Promise.all([cargoPromise, situacionPromise]);

                // Verificación de existencia de cargo, situación y materia
                if (!cargo) {
                    errorsObj.nombre_cargo = { msg: 'Cargo no encontrado' };
                    return res.render('admin/usuario', {
                        errors2: errorsObj,
                        old2: req.body,
                        activeForm: 'form2'
                    });
                }

                if (!situacion) {
                    errorsObj.condicion = { msg: 'Situacion no encontrada' };
                    return res.render('admin/usuario', {
                        errors2: errorsObj,
                        old2: req.body,
                        activeForm: 'form2'
                    });
                }

                // Crear el docente y obtener el nuevo ID
                await db.Docente.create({
                    apellido_docente,
                    nombre_docente,
                    fecha_nac_docente,
                    email_docente,
                    celular_docente,
                    dni_docente,
                    fk_idcargo_docente: cargo.idcargo,
                    fk_idsituacion_docente: situacion.idsituacion,
                    estado_docente: 1
                });

                // Redirección tras la creación exitosa
                res.redirect('/administrador/usuario');

            } catch (error) {
                console.error("Error al crear el alumno y tutor:", error);
                res.status(500).send('Ocurrió un error al crear el alumno y tutor.');
            }
        } else if (actionType === 'modificar') {
            try {
                // Validar errores en la solicitud
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.render('admin/usuario', {
                        errors2: errors.mapped(),
                        old2: req.body,
                        activeForm: 'form2'
                    });
                }

                let { apellido_docente, nombre_docente, fecha_nac_docente, email_docente, celular_docente, nombre_cargo, dni_docente, condicion } = req.body;
                email_docente = email_docente.toLowerCase();
                let errorsObj = {};

                // Obtener el docente actual basado en el DNI
                const docenteActual = await db.Docente.findOne({
                    where: { dni_docente }
                });

                // Verificar si el docente existe
                if (!docenteActual) {
                    errorsObj.dni_docente = { msg: 'Docente no encontrado' };
                    return res.render('admin/usuario', {
                        errors2: errorsObj,
                        old2: req.body,
                        activeForm: 'form2'
                    });
                }

                // Verificar si existen otros docentes con el mismo email o celular, excluyendo al actual
                const docenteExistente = await db.Docente.findOne({
                    attributes: ['dni_docente', 'email_docente', 'celular_docente'],
                    where: {
                        [Op.or]: [
                            { email_docente },
                            { celular_docente }
                        ],
                        iddocente: { [Op.ne]: docenteActual.iddocente }  // Excluir el docente actual
                    }
                });

                // Validar que el email y el celular no están en uso por otro docente
                if (docenteExistente) {
                    if (docenteExistente.email_docente === email_docente) {
                        errorsObj.email_docente = { msg: 'Este Email ya existe en otro docente' };
                    }
                    if (docenteExistente.celular_docente === celular_docente) {
                        errorsObj.celular_docente = { msg: 'Este Celular ya existe en otro docente' };
                    }
                }

                if (Object.keys(errorsObj).length > 0) {
                    return res.render('admin/usuario', {
                        errors2: errorsObj,
                        old2: req.body,
                        activeForm: 'form2'
                    });
                }

                // Buscar el cargo y situación correspondientes
                const cargo = await db.Cargo.findOne({ where: { nombre_cargo } });
                const situacion = await db.Situacion.findOne({ where: { nombre_situacion: condicion } });

                // Validar existencia de cargo y situación
                if (!cargo) {
                    errorsObj.nombre_cargo = { msg: 'Cargo no encontrado' };
                    return res.render('admin/usuario', {
                        errors2: errorsObj,
                        old2: req.body,
                        activeForm: 'form2'
                    });
                }

                if (!situacion) {
                    errorsObj.condicion = { msg: 'Situación no encontrada' };
                    return res.render('admin/usuario', {
                        errors2: errorsObj,
                        old2: req.body,
                        activeForm: 'form2'
                    });
                }

                // Actualizar el docente usando el ID obtenido
                await db.Docente.update(
                    {
                        apellido_docente,
                        nombre_docente,
                        fecha_nac_docente,
                        email_docente,
                        celular_docente,
                        dni_docente,
                        fk_idcargo_docente: cargo.idcargo,
                        fk_idsituacion_docente: situacion.idsituacion,
                        estado_docente: 1
                    },
                    { where: { iddocente: docenteActual.iddocente } }
                );

                res.redirect('/administrador/usuario');

            } catch (error) {
                console.error("Error al modificar el docente:", error);
                res.status(500).send('Ocurrió un error al modificar el docente.');
            }
        }

    },
    crear_alu_tut: async (req, res) => {

        const actionType = req.body.actionType;

        if (actionType === 'crear') {

            // Lógica para crear el alumno
            try {
                // Validar errores en la solicitud
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.render('admin/usuario', {
                        errors3: errors.mapped(),
                        old3: req.body,
                        activeForm: 'form3'
                    });
                }

                let {
                    apellido_alumno, nombre_alumno, fecha_nac_alumno, email_alumno,
                    celular_alumno, direccion_alumno, dni_alumno, genero_alumno,
                    apellido_tutor, nombre_tutor, email_tutor,
                    celular_tutor, direccion_tutor, dni_tutor
                } = req.body;

                email_alumno = email_alumno.toLowerCase();
                email_tutor = email_tutor.toLowerCase();

                let errorsObj = {};

                // Buscar alumno existente
                const alumno = await db.Alumno.findOne({
                    attributes: ['dni_alumno', 'email_alumno', 'celular_alumno'],
                    where: {
                        [Op.or]: [
                            { dni_alumno: dni_alumno },
                            { email_alumno: email_alumno },
                            { celular_alumno: celular_alumno }
                        ]
                    }
                });

                if (alumno) {
                    if (alumno.dni_alumno === dni_alumno) {
                        errorsObj.dni_alumno = { msg: 'Este DNI ya existe' };
                    }
                    if (alumno.email_alumno === email_alumno) {
                        errorsObj.email_alumno = { msg: 'Este Email ya Existe' };
                    }
                    if (alumno.celular_alumno === celular_alumno) {
                        errorsObj.celular_alumno = { msg: 'Este Celular ya Existe' };
                    }
                }

                if (Object.keys(errorsObj).length > 0) {
                    return res.render('admin/usuario', {
                        errors3: errorsObj,
                        old3: req.body,
                        activeForm: 'form3'
                    });
                }

                const genero = await db.Genero.findOne({
                    where: { nombre_genero: genero_alumno }
                });

                if (!genero) {
                    errorsObj.genero_alumno = { msg: 'Género no encontrado' };
                    return res.render('admin/usuario', {
                        errors3: errorsObj,
                        old3: req.body,
                        activeForm: 'form3'
                    });
                }

                let idNuevoTutor = null;

                // Crear tutor solo si se proporciona un DNI válido
                if (dni_tutor && dni_tutor.trim() !== "") {
                    let tutor = await db.Tutor.findOne({ where: { dni_tutor } });

                    if (!tutor) {
                        const tutorTemp = await db.Tutor.create({
                            apellido_tutor,
                            nombre_tutor,
                            email_tutor,
                            celular_tutor,
                            direccion_tutor,
                            dni_tutor,
                            estado_tutor: 1
                        });
                        idNuevoTutor = tutorTemp.idtutor;
                    } else {
                        idNuevoTutor = tutor.idtutor;
                    }
                }

                // Crear alumno
                await db.Alumno.create({
                    apellido_alumno,
                    nombre_alumno,
                    fecha_nac_alumno,
                    email_alumno,
                    celular_alumno,
                    direccion_alumno,
                    dni_alumno,
                    fk_idgenero_alumno: genero.idgenero,
                    fk_idtutor_alumno: idNuevoTutor, // Puede ser null si no hay tutor
                    estado_alumno: 1
                });

                res.redirect('/administrador/usuario');
            } catch (error) {
                console.error("Error al crear el alumno y tutor:", error);
                res.status(500).send('Ocurrió un error al crear el alumno y tutor.');
            }
        } else if (actionType === 'modificar') {
            try {
                console.log(req.body);

                // Validar errores en la solicitud
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.render('admin/usuario', {
                        errors3: errors.mapped(),
                        old3: req.body,
                        activeForm: 'form3'
                    });
                }

                let {
                    apellido_alumno, nombre_alumno, fecha_nac_alumno, email_alumno,
                    celular_alumno, direccion_alumno, dni_alumno, genero_alumno,
                    apellido_tutor, nombre_tutor, email_tutor,
                    celular_tutor, direccion_tutor, dni_tutor
                } = req.body;

                email_alumno = email_alumno.toLowerCase();
                email_tutor = email_tutor.toLowerCase();

                let errorsObj = {};

                // Obtener el alumno actual basado en el dni
                const alumnoActual = await db.Alumno.findOne({
                    where: { dni_alumno }
                });

                // Si el alumno no se encuentra, devolver un error
                if (!alumnoActual) {
                    errorsObj.dni_alumno = { msg: 'Alumno no encontrado' };
                    return res.render('admin/usuario', {
                        errors3: errorsObj,
                        old3: req.body,
                        activeForm: 'form3'
                    });
                }

                // Buscar otros alumnos con el mismo email o celular, excluyendo el actual por ID
                const alumnoExistente = await db.Alumno.findOne({
                    attributes: ['dni_alumno', 'email_alumno', 'celular_alumno'],
                    where: {
                        [Op.or]: [
                            { email_alumno: email_alumno },
                            { celular_alumno: celular_alumno }
                        ],
                        idalumno: { [Op.ne]: alumnoActual.idalumno }  // Excluir al alumno actual
                    }
                });

                if (alumnoExistente) {
                    if (alumnoExistente.email_alumno === email_alumno) {
                        errorsObj.email_alumno = { msg: 'Este Email ya existe en otro alumno' };
                    }
                    if (alumnoExistente.celular_alumno === celular_alumno) {
                        errorsObj.celular_alumno = { msg: 'Este Celular ya existe en otro alumno' };
                    }
                }

                if (Object.keys(errorsObj).length > 0) {
                    return res.render('admin/usuario', {
                        errors3: errorsObj,
                        old3: req.body,
                        activeForm: 'form3'
                    });
                }

                // Obtener el ID del género
                const genero = await db.Genero.findOne({
                    where: { nombre_genero: genero_alumno }
                });

                if (!genero) {
                    errorsObj.genero_alumno = { msg: 'Género no encontrado' };
                    return res.render('admin/usuario', {
                        errors3: errorsObj,
                        old3: req.body,
                        activeForm: 'form3'
                    });
                }

                // Lógica para buscar o crear el tutor
                let idNuevoTutor = null;
                if (dni_tutor && dni_tutor.trim() !== "") {
                    let tutor = await db.Tutor.findOne({ where: { dni_tutor } });
                    if (!tutor) {
                        const tutorTemp = await db.Tutor.create({
                            apellido_tutor,
                            nombre_tutor,
                            email_tutor,
                            celular_tutor,
                            direccion_tutor,
                            dni_tutor,
                            estado_tutor: 1
                        });
                        idNuevoTutor = tutorTemp.idtutor;
                    } else {
                        idNuevoTutor = tutor.idtutor;
                        await db.Tutor.update({
                            apellido_tutor,
                            nombre_tutor,
                            email_tutor,
                            celular_tutor,
                            direccion_tutor,
                            dni_tutor,
                            estado_tutor: 1
                        }, {
                            where: { idtutor: tutor.idtutor }  // Aquí se asegura de que solo actualice el tutor con el ID correspondiente
                        });

                    }
                }

                // Actualizar el alumno usando el ID obtenido
                await db.Alumno.update(
                    {
                        apellido_alumno,
                        nombre_alumno,
                        fecha_nac_alumno,
                        email_alumno,
                        celular_alumno,
                        direccion_alumno,
                        dni_alumno,
                        fk_idgenero_alumno: genero.idgenero,
                        fk_idtutor_alumno: idNuevoTutor,
                        estado_alumno: 1
                    },
                    { where: { idalumno: alumnoActual.idalumno } }
                );



                res.redirect('/administrador/usuario');
            } catch (error) {
                console.error("Error al modificar el alumno y tutor:", error);
                res.status(500).send('Ocurrió un error al modificar el alumno y tutor.');
            }
        }



    },
    crear_curso: async (req, res) => {
        const actionType = req.body.actionType;
        
        if (actionType === 'crear') {
        try {

            let errorsObj = {};
            let { anio_curso, division_curso, nombre_turno } = req.body;


            const cursoExistente = await db.Curso.findOne({
                where: {
                    anio_curso: anio_curso,
                    division_curso: division_curso
                }
            });
            if (cursoExistente) {
                errorsObj.anio_curso = { msg: 'Año y División existentes' };
                return res.render('admin/usuario', {
                    errors4: errorsObj,
                    old4: req.body,
                    activeForm: 'form4'
                });

            } else {

                let turno = await db.Turno.findOne({
                    attributes: ['idturno'],
                    where: { nombre_turno }
                });
                
                if (!turno) {
                    errorsObj.nombre_turno = { msg: 'Turno no encontrado' };
                    return res.render('admin/usuario', {
                        errors4: errorsObj,
                        old4: req.body,
                        activeForm: 'form4'
                    });
                }
                

                await db.Curso.create({
                    anio_curso: anio_curso,
                    division_curso: division_curso,
                    fk_idturno_curso: turno.idturno,
                    estado_curso: 1
                });

                return res.redirect('/administrador/usuario');
            }

        } catch (error) {
            console.error("Error al crear el curso:", error);
            res.status(500).send('Ocurrió un error al crear el curso.');
        } 
    } else if (actionType === 'modificar') {    
        try {
            let errorsObj = {};
            let { idcurso, anio_curso, division_curso, nombre_turno } = req.body;

            // Verificar si el curso existe
            const cursoActual = await db.Curso.findByPk(idcurso);
            if (!cursoActual) {
                errorsObj.idcurso = { msg: 'Curso no encontrado' };
                return res.render('admin/usuario', {
                    errors4: errorsObj,
                    old4: req.body,
                    activeForm: 'form4'
                });
            }

            // Buscar si existe otro curso con el mismo año y división, excluyendo el actual
            const cursoExistente = await db.Curso.findOne({
                where: {
                    anio_curso: anio_curso,
                    division_curso: division_curso,
                    idcurso: { [Op.ne]: idcurso } // Excluir el curso actual
                }
            });

            if (cursoExistente) {
                errorsObj.anio_curso = { msg: 'Año y División ya existen en otro curso' };
                return res.render('admin/usuario', {
                    errors4: errorsObj,
                    old4: req.body,
                    activeForm: 'form4'
                });
            }

            // Buscar el turno basado en el nombre proporcionado
            const turno = await db.Turno.findOne({
                attributes: ['idturno'],
                where: { nombre_turno }
            });

            if (!turno) {
                errorsObj.nombre_turno = { msg: 'Turno no encontrado' };
                return res.render('admin/usuario', {
                    errors4: errorsObj,
                    old4: req.body,
                    activeForm: 'form4'
                });
            }

            // Actualizar el curso
            await db.Curso.update(
                {
                    anio_curso: anio_curso,
                    division_curso: division_curso,
                    fk_idturno_curso: turno.idturno,
                    estado_curso: 1
                },
                { where: { idcurso: idcurso } }
            );

            res.redirect('/administrador/usuario');

        } catch (error) {
            console.error("Error al modificar curso:", error);
            res.status(500).send('Ocurrió un error al modificar el curso.');
        }
    }
},
    crear_materia: async (req, res) => {
            const actionType = req.body.actionType;
        
            if (actionType === 'crear') {
            try {
                let errorsObj = {};
                //limpieza de materia
                const removeAccents = (str) => {
                    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                }
    
                let { nombre_materia } = req.body;
                nombre_materia = nombre_materia.toLowerCase();
                nombre_materia = removeAccents(nombre_materia); // Quitar acentos
                nombre_materia = nombre_materia.trim(); // Quitar espacios al principio y al final
    
    
                const materiaExistente = await db.Materia.findOne({
                    where: {
                        nombre_materia: nombre_materia
                    }
                });
                if (materiaExistente) {
                    errorsObj.nombre_materia = { msg: 'Materia existente, prueba otro nombre' };
                    return res.render('admin/usuario', {
                        errors5: errorsObj,
                        old5: req.body,
                        activeForm: 'form5'
                    });
    
                } else {
    
                    await db.Materia.create({
                        nombre_materia: nombre_materia,
                        estado_materia: 1
                    });
    
                    return res.redirect('/administrador/usuario');
                }
            } catch (error) {
                console.error("Error al crear el materia:", error);
                res.status(500).send('Ocurrió un error al crear el materia.');
            } 
        } else if (actionType === 'modificar') { 
            try {
                let errorsObj = {};
                let { idmateria, nombre_materia } = req.body;
                
                // Limpieza de nombre_materia
                const removeAccents = (str) => {
                    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                };
    
                nombre_materia = nombre_materia.toLowerCase();
                nombre_materia = removeAccents(nombre_materia); // Quitar acentos
                nombre_materia = nombre_materia.trim(); // Quitar espacios al principio y al final
    
                // Verificar si la materia existe
                const materiaActual = await db.Materia.findByPk(idmateria);
                if (!materiaActual) {
                    errorsObj.idmateria = { msg: 'Materia no encontrada' };
                    return res.render('admin/usuario', {
                        errors5: errorsObj,
                        old5: req.body,
                        activeForm: 'form5'
                    });
                }
    
                // Buscar si existe otra materia con el mismo nombre, excluyendo la actual
                const materiaExistente = await db.Materia.findOne({
                    where: {
                        nombre_materia: nombre_materia,
                        idmateria: { [Op.ne]: idmateria } // Excluir la materia actual
                    }
                });
    
                if (materiaExistente) {
                    errorsObj.nombre_materia = { msg: 'Nombre de materia ya existe en otra materia' };
                    return res.render('admin/usuario', {
                        errors5: errorsObj,
                        old5: req.body,
                        activeForm: 'form5'
                    });
                }
    
                // Actualizar la materia
                await db.Materia.update(
                    {
                        nombre_materia: nombre_materia,
                        estado_materia: 1
                    },
                    { where: { idmateria: idmateria } }
                );
    
                res.redirect('/administrador/usuario');
            } catch (error) {
                console.error("Error al modificar la materia:", error);
                res.status(500).send('Ocurrió un error al modificar la materia.');
            }
        }

    },
    modificar: async (req, res) => {
        try {
            let data = [];
            let dataSelected = [];

            res.render('admin/modificar/modificar', { data, dataSelected });
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    modificarTabla: async (req, res) => {
        try {

            let data = [];
            let dataSelected = [];

            if (req.body.tabla === "Alumno") {

                //llega variable alumnos
                let data = await db.Alumno.findAll({
                    include: [
                        {
                            model: db.Genero,
                            as: 'Genero',
                            attributes: ['nombre_genero']
                        }
                    ],
                    attributes: {
                        exclude: ['fk_idgenero_alumno']
                    }
                });

                const dataSelected = data.map(alumno => ({
                    dni_alumno: alumno.dataValues.dni_alumno,
                    Email: alumno.dataValues.email_alumno,
                    Celular: alumno.dataValues.celular_alumno,
                    Apellido: alumno.dataValues.apellido_alumno,
                    Nombre: alumno.dataValues.nombre_alumno,
                    Direccion: alumno.dataValues.direccion_alumno,
                    Nacimiento: alumno.dataValues.fecha_nac_alumno,
                    Genero: alumno.dataValues.Genero.dataValues.nombre_genero,
                    Estado: alumno.dataValues.estado_alumno
                }));

                // Verificar que dataSelected no esté vacío antes de obtener las claves
                if (dataSelected.length > 0) {
                    data = Object.keys(dataSelected[0]);
                } else {
                    data = []; // Si dataSelected está vacío, data también estará vacío
                }
                return res.render('admin/modificar/modificar', { data, dataSelected });
            } else if (req.body.tabla === "Docente") {
                let data = await db.Docente.findAll({
                    include: [
                        {
                            model: db.Cargo,
                            as: 'Cargo',
                            attributes: ['nombre_cargo']
                        },
                        {
                            model: db.Situacion,
                            as: 'Situacion',
                            attributes: ['nombre_situacion']
                        }
                    ],
                    attributes: {
                        exclude: ['fk_idcargo_docente', 'fk_idsituacion_docente']
                    }
                });

                const dataSelected = data.map(docente => ({
                    dni_docente: docente.dataValues.dni_docente,
                    Email: docente.dataValues.email_docente,
                    Celular: docente.dataValues.celular_docente,
                    Apellido: docente.dataValues.apellido_docente,
                    Nombre: docente.dataValues.nombre_docente,
                    Nacimiento: docente.dataValues.fecha_nac_docente,
                    Cargo: docente.dataValues.Cargo.dataValues.nombre_cargo,
                    Situacion: docente.dataValues.Situacion.dataValues.nombre_situacion,
                    Estado: docente.dataValues.estado_docente
                }));

                // Verificar que dataSelected no esté vacío antes de obtener las claves
                if (dataSelected.length > 0) {
                    data = Object.keys(dataSelected[0]);
                } else {
                    data = []; // Si dataSelected está vacío, data también estará vacío
                }
                return res.render('admin/modificar/modificar', { data, dataSelected });


            } else if (req.body.tabla === "Usuario") {
                let data = await db.Usuario.findAll({
                    include: [
                        {
                            model: db.Rol,
                            as: 'Rol',
                            attributes: ['nombre_rol']
                        },
                        {
                            model: db.Docente,
                            as: 'Docente',
                            attributes: ['nombre_docente', 'apellido_docente']
                        }
                    ],
                    attributes: {
                        exclude: ['fk_idrol_usuario', 'fk_iddocente_usuario']
                    }
                });

                const dataSelected = data.map(usuario => ({
                    Usuario: usuario.dataValues.nombre_usuario,
                    Apellido: usuario.dataValues.Docente.dataValues.apellido_docente,
                    Nombre: usuario.dataValues.Docente.dataValues.nombre_docente,
                    Rol: usuario.dataValues.Rol.dataValues.nombre_rol,
                    Estado: usuario.dataValues.estado_usuario
                }));

                // Verificar que dataSelected no esté vacío antes de obtener las claves
                if (dataSelected.length > 0) {
                    data = Object.keys(dataSelected[0]);
                } else {
                    data = []; // Si dataSelected está vacío, data también estará vacío
                }
                return res.render('admin/modificar/modificar', { data, dataSelected });


            } else if (req.body.tabla === "Tutor") {
                let data = await db.Tutor.findAll();

                const dataSelected = data.map(tutor => ({
                    dni_tutor: tutor.dataValues.dni_tutor,
                    Email: tutor.dataValues.email_tutor,
                    Celular: tutor.dataValues.celular_tutor,
                    Apellido: tutor.dataValues.apellido_tutor,
                    Nombre: tutor.dataValues.nombre_tutor,
                    Direccion: tutor.dataValues.direccion_tutor,
                    Estado: tutor.dataValues.estado_tutor
                }));

                // Verificar que dataSelected no esté vacío antes de obtener las claves
                if (dataSelected.length > 0) {
                    data = Object.keys(dataSelected[0]);
                } else {
                    data = []; // Si dataSelected está vacío, data también estará vacío
                }
                return res.render('admin/modificar/modificar', { data, dataSelected });

            } else if (req.body.tabla === "Curso") {
                let data = await db.Curso.findAll({
                    include: [
                        {
                            model: db.Turno,
                            as: 'Turno',
                            attributes: ['nombre_turno']
                        }
                    ],
                    attributes: {
                        exclude: ['fk_idturno_curso']
                    }
                });

                const dataSelected = data.map(curso => ({
                    idcurso: curso.dataValues.idcurso,
                    año: curso.dataValues.anio_curso,
                    division: curso.dataValues.division_curso,
                    turno: curso.dataValues.Turno.dataValues.nombre_turno,
                    Estado: curso.dataValues.estado_curso
                }));

                // Verificar que dataSelected no esté vacío antes de obtener las claves
                if (dataSelected.length > 0) {
                    data = Object.keys(dataSelected[0]);
                } else {
                    data = []; // Si dataSelected está vacío, data también estará vacío
                }
                return res.render('admin/modificar/modificar', { data, dataSelected });

            } else if (req.body.tabla === "Materia") {
                let data = await db.Materia.findAll();

                const dataSelected = data.map(materia => ({
                    idmateria: materia.dataValues.idmateria,
                    Materia: materia.dataValues.nombre_materia,
                    Estado: materia.dataValues.estado_materia
                }));

                // Verificar que dataSelected no esté vacío antes de obtener las claves
                if (dataSelected.length > 0) {
                    data = Object.keys(dataSelected[0]);
                } else {
                    data = []; // Si dataSelected está vacío, data también estará vacío
                }
                return res.render('admin/modificar/modificar', { data, dataSelected });

            }

            res.redirect('/administrador/usuario/modificar')
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    eliminarUser: async (req, res) => {
        try {
            let idusuario = req.params.idusuario
            await db.Usuario.destroy({
                where: {
                    idusuario
                }
            })
            res.redirect('/administrador/usuario/modificar')
        } catch (error) {
            console.error("Error :", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    eliminarDocente: async (req, res) => {
        try {
            let iddocente = req.params.iddocente
            // Busca el registro del docente
            let docente = await db.docente.findByPk(iddocente);

            if (docente) {
                // Elimina todas las referencias en la tabla docentees_materias
                await db.docente_Materia.destroy({
                    where: { fk_iddocente_docentemateria: iddocente }
                });

                // Elimina todas las referencias en la tabla usuarios
                await db.Usuario.destroy({
                    where: { fk_iddocente_usuario: iddocente }
                });

                // Elimina el docente
                await db.docente.destroy({
                    where: { iddocente }
                });

            }
            res.redirect('/administrador/usuario/modificar')
        } catch (error) {
            console.error("Error :", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    eliminarAlumno: async (req, res) => {
        try {
            let { dni, estado } = req.body
            let alumno = await db.Alumno.findOne({
                where: {
                    "dni_alumno": dni
                }
            })

            if (alumno) {
                await db.Alumno.update(
                    { "estado_alumno": estado }, // Datos a actualizar
                    {
                        where: { dni_alumno: dni }  // Condición de búsqueda
                    }
                );

            }

            console.log(req.body);


            // Busca el registro del docente
            // let alumno = await db.Alumno.findByPk(idalumno);

            // if (alumno) {
            // // Elimina todas las referencias en la tabla docentees_materias
            // await db.docente_Materia.destroy({
            //     where: { fk_iddocente_docentemateria: iddocente }
            // });

            // // Elimina todas las referencias en la tabla usuarios
            // await db.Usuario.destroy({
            //     where: { fk_iddocente_usuario: iddocente }
            // });

            // Elimina el alumno
            // await db.Alumno.destroy({
            //     where: { idalumno }
            // });

            // }
            res.redirect('/administrador/usuario/modificar')
        } catch (error) {
            console.error("Error :", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    modificarUserOne: async (req, res) => {
        try {
            let idusuario = req.params.nuevo_usuario

            let usuario = await db.Usuario.findOne({
                include: [
                    {
                        model: db.Rol,
                        as: 'Rol'
                    },
                    {
                        model: db.Docente,
                        as: 'Docente'
                    }
                ],
                attributes: {
                    exclude: ['fk_iddocente_usuario', 'fk_idrol_usuario']
                },
                where: {
                    "nombre_usuario": idusuario
                }
            })
            const old1 = {
                nombre_usuario: usuario.dataValues.nombre_usuario,
                nombre_rol: usuario.dataValues.Rol ? usuario.dataValues.Rol.dataValues.nombre_rol : null,
                dni_docente: usuario.dataValues.Docente ? usuario.dataValues.Docente.dataValues.dni_docente : null
            };


            if (usuario) {
                return res.render('admin/usuario', {
                    old1,
                    activeForm: 'form1'
                });
            }
            //luego hago un tratado del error por si no existe
            res.redirect('/administrador/usuario')

            res.redirect('/administrador/usuario')
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    modificarDocenteOne: async (req, res) => {
        try {
            let dni = req.params.dni_docente

            let docente = await db.Docente.findOne({
                include: [
                    {
                        model: db.Cargo,
                        as: 'Cargo'
                    },
                    {
                        model: db.Situacion,
                        as: 'Situacion'
                    }
                ],
                attributes: {
                    exclude: ['fk_idcargo_docente', 'fk_idsituacion_docente']
                },
                where: {
                    "dni_docente": dni
                }
            })

            if (docente) {
                return res.render('admin/usuario', {
                    old2: docente,
                    activeForm: 'form2'
                });
            }
            //luego hago un tratado del error por si no existe
            res.redirect('/administrador/usuario')
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    modificarAlumnoOne: async (req, res) => {
        try {
            let dni = req.params.dni_alumno

            let alumno = await db.Alumno.findOne({
                include: [
                    {
                        model: db.Tutor,
                        as: 'Tutor'
                    },
                    {
                        model: db.Genero,
                        as: 'Genero'
                    }
                ],
                attributes: {
                    exclude: ['fk_idtutor_alumno', 'fk_idgenero_alumno']
                },
                where: {
                    "dni_alumno": dni
                }
            })

            if (alumno) {
                return res.render('admin/usuario', {
                    old3: alumno,
                    activeForm: 'form3'
                });
            }
            //luego hago un tratado del error por si no existe
            res.redirect('/administrador/usuario')
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    modificarCursoOne: async (req, res) => {
        try {
            let idcurso = req.params.idcurso

            let curso = await db.Curso.findOne({
                include: [
                    {
                        model: db.Turno,
                        as: 'Turno'
                    }
                ],
                attributes: {
                    exclude: ['fk_idturno_curso']
                },
                where: {
                    "idcurso": idcurso
                }
            })

            if (curso) {
                return res.render('admin/usuario', {
                    old4: curso,
                    activeForm: 'form4'
                });
            }
            //luego hago un tratado del error por si no existe
            res.redirect('/administrador/usuario')
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    modificarMateriaOne: async (req, res) => {
        try {
            let idmateria = req.params.idmateria
            
            let materia = await db.Materia.findOne({
                where: {
                    "idmateria": idmateria
                }
            })

            if (materia) {
                return res.render('admin/usuario', {
                    old5: materia,
                    activeForm: 'form5'
                });
            }
            //luego hago un tratado del error por si no existe
            res.redirect('/administrador/usuario')
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    }
}