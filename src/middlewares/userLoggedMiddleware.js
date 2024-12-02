const db = require('../database/models');

async function userLoggedMiddleware(req, res, next) {
    res.locals.isLogged = false;

    try {
        if (req.session && req.session.userLogged) {
            res.locals.isLogged = true;
            res.locals.userLogged = req.session.userLogged;
        } else if (req.cookies.userSession) {
            // Sanitizo y valido cookie
            const cookieValue = req.cookies.userSession;
            if (!/^[a-zA-Z0-9]+$/.test(cookieValue)) {
                console.error("Formato de cookie inválido");
                return next();
            }

            // Recuperar usuario basado en la cookie
            const usuarioCookie = await db.Usuario.findOne({
                attributes: ['nombre_usuario', 'fk_iddocente_usuario'],
                include: [{
                    model: db.Rol,
                    as: 'Rol',
                    attributes: ['nombre_rol']
                }],
                where: {
                    nombre_usuario: cookieValue,
                    estado_usuario:1
                }
            });

            if (usuarioCookie) {
                const materiacurso = await db.Materia_Curso.findAll({
                    attributes: ['idmateriacurso'],
                    include: [
                        {
                            association: 'Materia',
                            attributes: ['nombre_materia']
                        },
                        {
                            association: 'Curso',
                            attributes: ['anio_curso', 'division_curso', 'fk_idturno_curso'],
                            include: [{
                                association: 'Turno',
                                attributes: ['nombre_turno']
                            }]
                        }
                    ],
                    where: {
                        fk_iddocente_materiacurso: usuarioCookie.fk_iddocente_usuario,
                        estado_materiacurso:1
                    }
                });

                let materias = [...new Set(materiacurso.map(mc => mc.dataValues.Materia.dataValues.nombre_materia))];

                let cursos = materiacurso.map(docenteCurso => ({
                    idmateriacurso: docenteCurso.dataValues.idmateriacurso,
                    nombre_materia: docenteCurso.dataValues.Materia.dataValues.nombre_materia,
                    anio_curso: docenteCurso.dataValues.Curso.dataValues.anio_curso,
                    division_curso: docenteCurso.dataValues.Curso.dataValues.division_curso,
                    nombre_turno: docenteCurso.dataValues.Curso.dataValues.Turno.dataValues.nombre_turno
                }));

                req.session.userLogged = {
                    usuario: usuarioCookie.nombre_usuario,
                    rol: usuarioCookie.Rol.nombre_rol,
                    materias,
                    cursos
                };

                res.locals.isLogged = true;
                res.locals.userLogged = req.session.userLogged;
            }
        }
    } catch (error) {
        console.error("Error al verificar el usuario:", error);
    }

    next();
}

module.exports = userLoggedMiddleware;
