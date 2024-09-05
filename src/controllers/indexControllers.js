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
                maxAge: rememberMe ? 24 * 60 * 60 * 1000 : undefined 
            };
            res.cookie('userSession', loginUser, cookieOptions);
    
            // Buscar materias y cursos del docente
            const materiacurso = await db.Materia_Curso.findAll({
                attributes: ['idmateriacurso','turno_materiacurso'],
                include: [{
                    association: 'Materia',
                    attributes: ['nombre_materia']
                },{
                    association: 'Curso',
                    attributes:['anio_curso','division_curso']
                }],
                where: {
                    fk_iddocente_materiacurso: user.fk_iddocente_usuario
                }
            });
    
            let materias = [...new Set(materiacurso.map(mc => mc.dataValues.Materia.dataValues.nombre_materia))];
    
            let cursos = materiacurso.map(docenteCurso => ({
                idmateriacurso: docenteCurso.dataValues.idmateriacurso,
                nombre_materia: docenteCurso.dataValues.Materia.dataValues.nombre_materia,
                anio_curso: docenteCurso.dataValues.Curso.dataValues.anio_curso,
                division_curso: docenteCurso.dataValues.Curso.dataValues.division_curso,
                turno: docenteCurso.dataValues.turno_materiacurso
            }));
    
            // Configuración de la sesión
            req.session.userLogged = {
                usuario: loginUser,
                rol: user.Rol.nombre_rol,
                materias,
                cursos
            };
            console.log(req.session.userLogged);
            
            return res.redirect('/welcome');
    
        } catch (error) {
            console.error('Error en la verificación de acceso:', error);
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
