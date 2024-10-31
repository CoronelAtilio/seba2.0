const db = require('../database/models')
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');


module.exports = {
    admin: (req, res) => {
        res.render('admin/usuario')
    },
    crear_usuario: async (req, res) => {
        try {
            const errors = validationResult(req);
            let errorsObj = errors.mapped();
            const { nombre_usuario, password_usuario, password_usuario2, permisos, dni_docente } = req.body;

            // Verificación de contraseñas
            if (password_usuario !== password_usuario2) {
                errorsObj.password_usuario2 = { msg: 'No Coinciden Contraseñas' };
            }

            // Verificación de existencia de usuario
            const usuarioBuscado = await db.Usuario.findOne({
                where: { nombre_usuario }
            });

            if (usuarioBuscado) {
                errorsObj.nombre_usuario = { msg: 'Este usuario ya Existe' };
            }

            // Verificación de existencia de profesoor
            const docenteBuscado = await db.Docente.findOne({
                where: { dni_docente }
            });

            if (!docenteBuscado) {
                errorsObj.dni_docente = { msg: 'Este Docente no existe. Primero crea el docente' };
            }
            // Retorno de errores si existen
            if (Object.keys(errorsObj).length > 0) {
                return res.render('admin/usuario', {
                    errors1: errorsObj,
                    old1: req.body,
                    activeForm: 'form1' // ID del formulario a mostrar
                });
            }

            // Búsqueda de cargo y creación de usuario de manera asíncrona
            const rolPromise = db.Rol.findOne({
                where: { nombre_rol: permisos.toLowerCase() }
            });

            const hashedPasswordPromise = bcrypt.hash(password_usuario, 10);

            const [rol, hashedPassword] = await Promise.all([rolPromise, hashedPasswordPromise]);

            if (!rol) {
                errorsObj.nombre_cargo = { msg: 'Cargo no encontrado' };
                return res.render('admin/usuario', {
                    errors1: errorsObj,
                    old1: req.body,
                    activeForm: 'form1'
                });
            }
            await db.Usuario.create({
                password_usuario: hashedPassword,
                nombre_usuario,
                fk_idrol_usuario: rol.idrol,
                fk_iddocente_usuario: docenteBuscado.iddocente,
                estado_usuario: 1
            });

            // Redirección tras la creación exitosa
            res.redirect('/administrador/usuario');

        } catch (error) {
            console.log(error.message);
            res.status(500).send('Error del servidor: ' + error.message);
        }
    },
    crear_docente: async (req, res) => {
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
            console.log(error.message);
            res.send(error.message);
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
            // Lógica para modificar el alumno
        }

       
    },
    crear_curso: async (req, res) => {
        try {
            // Validar errores en la solicitud
            //   const errors = validationResult(req);
            //   if (!errors.isEmpty()) {
            //       return res.render('admin/usuario', {
            //           errors3: errors.mapped(),
            //           old3: req.body,
            // activeForm: 'form3'
            //       });
            //   }

            let errorsObj = {};
            let { anio_curso, division_curso } = req.body;
            anio_curso = anio_curso.toLowerCase()
            division_curso = division_curso.toUpperCase()

            const cursoExistente = await db.Curso.findOne({
                where: {
                    anio_curso: anio_curso,
                    division_curso: division_curso
                }
            });
            if (cursoExistente) {
                errorsObj.anio_curso = { msg: 'Año y División coincidentes' };
                return res.render('admin/usuario', {
                    errors4: errorsObj,
                    old4: req.body,
                    activeForm: 'form4'
                });

            } else {

                await db.Curso.create({
                    anio_curso: anio_curso,
                    division_curso: division_curso,
                    estado_curso: 1
                });

                return res.redirect('/administrador/usuario');
            }

        } catch (error) {
            console.error("Error al crear el curso:", error);
            res.status(500).send('Ocurrió un error al crear el curso.');
        }
    },
    crear_materia: async (req, res) => {
        try {
            // Validar errores en la solicitud
            //   const errors = validationResult(req);
            //   if (!errors.isEmpty()) {
            //       return res.render('admin/usuario', {
            //           errors3: errors.mapped(),
            //           old3: req.body,
            // activeForm: 'form3'
            //       });
            //   }

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
            console.error("Error al crear la materia:", error);
            res.status(500).send('Ocurrió un error al crear la materia.');
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
            let idusuario = req.params.idusuario
            let usuario = await db.Usuario.findByPk(idusuario)

            res.render('admin/modificar/modificarUsuario', { usuario })
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    modificarDocenteOne: async (req, res) => {
        try {
            let iddocente = req.params.iddocente
            let docente = await db.docente.findByPk(iddocente)

            res.render('admin/modificar/modificarDocente', { docente })
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
            console.log(alumno);

            if (alumno) {
                return res.render('admin/usuario', {
                    old3: alumno,
                    activeForm: 'form3'
                });
            }

            res.redirect('/administrador/usuario')
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    }
}