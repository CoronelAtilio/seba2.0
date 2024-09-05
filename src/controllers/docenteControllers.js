const db = require('../database/models');
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
const { Op, Sequelize } = require('sequelize');
const sequelize = db.sequelize;

module.exports = {
    index: async (req, res) => {
        try {
            let alumnos = await db.Alumno.findAll()
            
            res.render('curso/curso',{alumnos});
        } catch (error) {
            console.error("Error al obtener cursos:", error);
            res.status(500).send('Ocurrió un error al obtener los cursos.');
        }
    },
    nota_alu: async(req,res)=>{
        try {
            let idcurso = req.params.id_curso; 
            let materias = req.session.userLogged.materias.map(materia => materia.toLowerCase());
            
            if (!(req.session && req.session.userLogged)) {
                res.send('No estas Logueado')
            }
            let materiasResult = await db.Materia.findAll({
                where: {
                    nombre_materia: {
                        [Op.in]: materias
                    }
                },
                attributes: ['idmateria']
            });
    
            let idmaterias = materiasResult.map(materia => materia.idmateria);
            let prueba = await db.Al_Mat_Not_Cur.findAll({
                include: [
                    {
                        model: db.Curso,
                        as: 'Curso',
                        attributes: ['anio_curso', 'division_curso', 'turno_curso']
                    },
                    {
                        model: db.Alumno,
                        as: 'Alumno',
                        attributes: ['apellido_alumno', 'nombre_alumno', 'dni_alumno']
                    },
                    {
                        model: db.Nota,
                        as: 'Nota',
                        attributes: ['nombre_nota']
                    }
                ],
                where: {
                    fk_idcurso_almatnotcur: idcurso,
                    fk_idmateria_almatnotcur: {
                        [Op.in]: idmaterias
                    }
                },
                attributes: ['valor_nota', 'obs'],
                order: [[{ model: db.Alumno, as: 'Alumno' }, 'apellido_alumno', 'ASC']]
            });

            const data = {};
            const order = ['nota_1', 'nota_2', 'nota_final', 'nota_dic', 'nota_feb', 'nota_def'];
            
            prueba.forEach(result => {
                const alumno = result.Alumno;
                const curso = result.Curso;
                const nota = result.Nota;
            
                const alumnoKey = alumno.dni_alumno;
            
                if (!data[alumnoKey]) {
                    data[alumnoKey] = {
                        alumno: {
                            apellido: alumno.apellido_alumno,
                            nombre: alumno.nombre_alumno,
                            dni: alumno.dni_alumno
                        },
                        curso: {
                            anio: curso.anio_curso,
                            division: curso.division_curso,
                            turno: curso.turno_curso
                        },
                        notas: [],
                        obs: result.obs
                    };
                }
            
                data[alumnoKey].notas.push({
                    nombreNota: nota.nombre_nota,
                    valorNota: result.valor_nota
                });
            
                // Ordenar las notas según el orden especificado
                data[alumnoKey].notas.sort((a, b) => {
                    return order.indexOf(a.nombreNota) - order.indexOf(b.nombreNota);
                });
            });

            if (Object.keys(data).length === 0) {
                console.log("este profesor no puede acceder a dicha materia");
                res.redirect('/curso');
                return;
            }
            
            

            // console.log(JSON.stringify(data, null, 2));

            res.render('curso/curso',{data});
        } catch (error) {
            console.error("Error al obtener cursos:", error);
            res.status(500).send('Ocurrió un error al obtener los cursos.');
        }
    },
    cursoSelected: async(req,res)=>{
        try {
            console.log(req.body);
            res.redirect('/docente')
            
        } catch (error) {
            console.error("Error al obtener cursos:", error);
            res.status(500).send('Ocurrió un error al obtener los cursos.');
        }
    }
};
