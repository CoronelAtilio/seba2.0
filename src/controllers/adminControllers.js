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
                });
            }

            if (!situacion) {
                errorsObj.condicion = { msg: 'Situacion no encontrada' };
                return res.render('admin/usuario', {
                    errors2: errorsObj,
                    old2: req.body,
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
        try {
            // Validar errores en la solicitud
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('admin/usuario', {
                    errors3: errors.mapped(),
                    old3: req.body,
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
                        dni_tutor
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
    },
    crear_curso: async (req,res)=>{
        try {
              // Validar errores en la solicitud
            //   const errors = validationResult(req);
            //   if (!errors.isEmpty()) {
            //       return res.render('admin/usuario', {
            //           errors3: errors.mapped(),
            //           old3: req.body,
            //       });
            //   }

            let errorsObj = {};
            let {anio_curso,division_curso} = req.body;
            anio_curso=anio_curso.toLowerCase()
            division_curso=division_curso.toUpperCase()
            
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
    crear_materia: async (req,res)=>{
        try {
            // Validar errores en la solicitud
          //   const errors = validationResult(req);
          //   if (!errors.isEmpty()) {
          //       return res.render('admin/usuario', {
          //           errors3: errors.mapped(),
          //           old3: req.body,
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
                  nombre_materia:nombre_materia
              }
          });
          if (materiaExistente) {
              errorsObj.nombre_materia = { msg: 'Materia existente, prueba otro nombre' };
              return res.render('admin/usuario', {
                  errors5: errorsObj,
                  old5: req.body,
              });
               
          } else {

              await db.Materia.create({
                  nombre_materia:nombre_materia,
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
    
            if (req.session && req.session.dataSelected) {
                dataSelected = req.session.dataSelected;
                delete req.session.dataSelected;
    
                // Obtener los keys del primer objeto y almacenarlos en un array (atributos)
                data = Object.keys(dataSelected[0]);
    
                console.log(data);
                
                // Aquí dataSelected sigue siendo el array original de objetos
                return res.render('admin/modificar/modificar', { data, dataSelected });
            }
    
            res.render('admin/modificar/modificar', { data, dataSelected });
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    
    modificarTabla: async (req, res) => {
        try {
            //llega variable alumnos
            const data = await db.Alumno.findAll({
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
                dni: alumno.dataValues.dni_alumno,
                Email: alumno.dataValues.email_alumno,
                Celular: alumno.dataValues.celular_alumno,
                Apellido: alumno.dataValues.apellido_alumno,
                Nombre: alumno.dataValues.nombre_alumno,
                Direccion: alumno.dataValues.direccion_alumno,
                Nacimiento: alumno.dataValues.fecha_nac_alumno,
                Genero: alumno.dataValues.Genero.dataValues.nombre_genero 
              }));
              
            req.session.dataSelected = dataSelected;
            console.log(req.session.dataSelected);
            
            
            res.redirect('/administrador/usuario/modificar')
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    },
    modificarRelacion: async (req, res) => {
        try {
            let alumnos = await db.Alumno.findAll()
            let docentes = await db.Docente.findAll()
            let usuarios = await db.Usuario.findAll()
            res.render('admin/modificar/modificar', { alumnos, docentes, usuarios })
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
            let idalumno = req.params.idalumno
            // Busca el registro del docente
            let alumno = await db.Alumno.findByPk(idalumno);

            if (alumno) {
                // // Elimina todas las referencias en la tabla docentees_materias
                // await db.docente_Materia.destroy({
                //     where: { fk_iddocente_docentemateria: iddocente }
                // });

                // // Elimina todas las referencias en la tabla usuarios
                // await db.Usuario.destroy({
                //     where: { fk_iddocente_usuario: iddocente }
                // });

                // Elimina el alumno
                await db.Alumno.destroy({
                    where: { idalumno }
                });

            }
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
            let idalumno = req.params.idalumno
            let alumno = await db.Alumno.findByPk(idalumno)

            res.render('admin/modificar/modificarAlumno', { alumno })
        } catch (error) {
            console.error("Error modificar:", error);
            res.status(500).send('Ocurrió un error.');
        }
    }
}