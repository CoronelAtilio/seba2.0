const db = require('../database/models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");

module.exports = {
    acceso: (req, res) => {
        res.render("index/acceso");
    },
    accesoVerificacion: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("index/acceso", {
                errors: errors.mapped(),
                old: req.body,
            });
        }

        const { loginUser, loginPass, rememberMe } = req.body;

        try {
            const user = await db.Usuario.findOne({
                attributes: ['nombre_usuario', 'fk_iddocente_usuario', 'password_usuario'],
                include: [{
                    model: db.Rol,
                    as: 'Rol',
                    attributes: ['nombre_rol']
                }],
                where: {
                    nombre_usuario: {
                        [Op.like]: loginUser
                    }
                }
            });

            if (!user) {
                return res.render("index/acceso", {
                    errors: { loginUser: { msg: 'Usuario no encontrado' } },
                    old: req.body,
                });
            }

            const passwordMatch = await bcrypt.compare(loginPass, user.password_usuario);

            if (!passwordMatch) {
                return res.render("index/acceso", {
                    errors: { loginPass: { msg: 'Contraseña incorrecta' } },
                    old: req.body,
                });
            }

            // Configuración de la cookie
            const cookieOptions = {
                httpOnly: true,
                maxAge: rememberMe ? 24 * 60 * 60 * 1000 : undefined // 1 día en milisegundos si rememberMe es true
            };
            res.cookie('userSession', loginUser, cookieOptions);

            //Busco materia
            let materia = await db.Materia_Curso.findAll({
                include: [{
                    association: 'Materia',
                    attributes: ['nombre_materia']
                }],
                where: {
                    fk_iddocente_materiacurso: user.fk_iddocente_usuario
                }
            })
            let materias = []
            materia.forEach(docenteMateria => {
                materias.push(docenteMateria.dataValues.Materia.dataValues.nombre_materia);
            });

            // Configuración de la sesión
            req.session.userLogged = {
                usuario: loginUser,
                rol: user.Rol.nombre_rol,
                materias
            };

            return res.redirect('/welcome');

        } catch (error) {
            console.error('Error en la verificación de acceso:', error);
            // Respuesta genérica para no revelar detalles del error al usuario
            return res.status(500).render("index/acceso", {
                errors: { general: { msg: 'Ocurrió un error, por favor intenta nuevamente.' } },
                old: req.body,
            });
        }
    },
    bienvenida: async (req, res) => {
        try {
            // Aquí ejecuto actualización necesaria
            // await db.sequelize.query('ANALYZE TABLE vista_tablas;');

            // const tablas = await db.Vista_Tabla.findAll({
            //     attributes: [
            //         ['tablas', 'Tablas']
            //     ]
            // });
            res.render('index/bienvenida'/*, { tablas }*/);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    },
    bienvenidaSearch: async (req, res) => {
        try {
            // await db.sequelize.query('ANALYZE TABLE vista_tablas;');

            // const search = req.query.search || '';

            // // Consulta con búsqueda (like)
            // const tablas = await db.Vista_Tabla.findAll({
            //     attributes: [
            //         ['tablas', 'Tablas']
            //     ],
            //     where: {
            //         tablas: {
            //             [Op.like]: `%${search}%`
            //         }
            //     }
            // });

            res.render('index/bienvenida'/*, { tablas }*/);

        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    },
    logout: (req, res) => {
        res.clearCookie('userSession');
        req.session.destroy();
        return res.redirect("/");
    }

};
