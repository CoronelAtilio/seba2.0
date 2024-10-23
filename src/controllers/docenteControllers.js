const db = require('../database/models');
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
const { Op, Sequelize, where } = require('sequelize');
const sequelize = db.sequelize;

module.exports = {
    index: async (req, res) => {
        try {
            let alumnos = []
            let nombre_materia = []
            res.render('curso/curso',{alumnos, nombre_materia});

        } catch (error) {
            console.error("Error al obtener cursos:", error);
            res.status(500).send('Ocurrió un error al obtener los cursos.');
        }
    },
    cursoSelected: async(req,res)=>{
        try {
            let [anio,division,ciclo_lectivo_nota,nombre_materia] = req.body.cursociclo
            
            let [materia, curso] = await Promise.all([
                db.Materia.findOne({
                    where: {
                        "nombre_materia": nombre_materia
                    },
                    attributes: ["idmateria"]
                }),
                db.Curso.findOne({
                    where: {
                        "anio_curso": anio,
                        "division_curso": division
                    },
                    attributes: ["idcurso"]
                })
            ]);
  

            let materiacurso = await db.Materia_Curso.findAll({
                where: {
                    "fk_idcurso_materiacurso": curso.idcurso,
                    "fk_idmateria_materiacurso": materia.idmateria
                },
                attributes: ['idmateriacurso']
            });

            let alumnos =[]
            
            // Verifica si se obtuvieron resultados y accede al primer elemento
            if (materiacurso.length > 0) {
                materiacurso = materiacurso[0].dataValues; // Accede a los valores
                alumnos = await db.Nota.findAll({
                    where: {
                        "fk_idmateriacurso_nota": materiacurso.idmateriacurso,
                        "ciclo_lectivo_nota": ciclo_lectivo_nota
                    },
                    include: [
                        {
                            model: db.Alumno,
                            as: 'Alumno',
                            attributes: ['dni_alumno','apellido_alumno','nombre_alumno'] 
                        }
                    ],
                    attributes: {
                        exclude: ['fk_idalumno_nota','fk_idmateriacurso_nota'] 
                    }
                });
            } 
            
            
            res.render('curso/curso',{ alumnos, nombre_materia });
            
        } catch (error) {
            console.error("Error al obtener cursos:", error);
            res.status(500).send('Ocurrió un error al obtener los cursos.');
        }
    },
    nota_alu: async(req,res)=>{
        try {
            console.log(req.body);
            
            res.redirect('/docente')
        } catch (error) {
            console.error("Error al obtener cursos:", error);
            res.status(500).send('Ocurrió un error al obtener los cursos.');
        }
    }
};
