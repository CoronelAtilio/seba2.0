const db = require('../database/models');

async function userLoggedMiddleware(req, res, next) {
    res.locals.isLogged = false;

    try {
        // Primero verifico si la sesión ya tiene el usuario logueado
        if (req.session && req.session.userLogged) {
            res.locals.isLogged = true;
            res.locals.userLogged = req.session.userLogged;
        } else if (req.cookies.userSession) {
            //Sanitizo cookie
            const cookieValue = req.cookies.userSession;
            // Valida el formato del cookieValue
            if (!/^[a-zA-Z0-9]+$/.test(cookieValue)) {
                console.error("Formato de cookie inválido");
                return next();
            }
            // Si no hay usuario logueado en la sesión, verifica la cookie
            const usuarioCookie = await db.Usuario.findOne({
                attributes: ['nombre_usuario', 'fk_iddocente_usuario'],
                include: [{
                    model: db.Rol,
                    as: 'Rol',
                    attributes: ['nombre_rol']
                }],
                where: {

                    nombre_usuario: req.cookies.userSession

                }
            });

            // Si se encuentra el usuario en la base de datos, almacena la información en la sesión
            if (usuarioCookie) {
                //Busco materia
                let materia = await db.Materia_Curso.findAll({
                    include: [{
                        association: 'Materia',
                        attributes: ['nombre_materia']
                    }],
                    where: {
                        fk_iddocente_materiacurso: usuarioCookie.fk_iddocente_usuario
                    }
                })
                let materias = []
                materia.forEach(docenteMateria => {
                    materias.push(docenteMateria.dataValues.Materia.dataValues.nombre_materia.toUpperCase());
                });
                req.session.userLogged = {
                    usuario: usuarioCookie.nombre_usuario,
                    rol: usuarioCookie.Rol.nombre_rol,
                    materias
                };
                res.locals.isLogged = true;
                res.locals.userLogged = req.session.userLogged;
            }
        }
    } catch (error) {
        console.error("Error al verificar el usuario:", error);
    }

    next();
};

module.exports = userLoggedMiddleware;
