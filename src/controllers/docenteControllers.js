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
                        "nombre_materia": nombre_materia,
                        "estado_materia":1
                    },
                    attributes: ["idmateria"]
                }),
                db.Curso.findOne({
                    where: {
                        "anio_curso": anio,
                        "division_curso": division,
                        "estado_curso":1
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
                            attributes: ['dni_alumno','apellido_alumno','nombre_alumno'],
                            where: { 
                                estado_alumno: 1
                            }
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
    nota_alu: async (req, res) => {
        try {
            console.log(req.body);
    
            const { example_length, ...notas } = req.body; // Separar example_length del resto de las notas
            const updates = {}; // Objeto para almacenar las actualizaciones agrupadas por idnota
    
            // Procesar todas las claves
            for (const key in notas) {
                const [campoNota, idnota] = key.split('_'); // Separar el campo (nota1, nota2, etc.) del idnota
    
                // Validar que la clave tiene el formato esperado
                if (!campoNota || !idnota) continue;
    
                if (!updates[idnota]) updates[idnota] = {}; // Crear una entrada para este idnota si no existe
                updates[idnota][campoNota + '_nota'] = notas[key] !== '' ? parseFloat(notas[key]) : null; // Asignar valor o null
            }
    
            // Calcular nota3 como el promedio de nota1 y nota2
            for (const idnota in updates) {
                const nota1 = updates[idnota].nota1_nota ?? null; // Obtener nota1
                const nota2 = updates[idnota].nota2_nota ?? null; // Obtener nota2
    
                // Verificar si ambos valores existen
                if (nota1 !== null && nota2 !== null) {
                    const promedio = (nota1 + nota2) / 2;
                    updates[idnota].nota3_nota = parseFloat(promedio.toFixed(2)); // Calcular y redondear a 2 decimales
                } else {
                    updates[idnota].nota3_nota = null; // Si falta alguno, dejar nota3 como null
                }
            }
    
            // Mostrar la cantidad de registros procesados
            const idsProcesados = Object.keys(updates).length;
            console.log(`Cantidad de registros procesados: ${idsProcesados}`);
    
            // Debug adicional: Mostrar los datos que se actualizarán
            console.log("Datos preparados para la BD:", updates);
    
            // Actualizar cada registro en la base de datos
            const promises = Object.keys(updates).map(async (idnota) => {
                const data = updates[idnota];
                await db.Nota.update(data, { where: { idnota } });
            });
    
            await Promise.all(promises); // Ejecutar todas las actualizaciones en paralelo
    
            // Redirigir al usuario con un mensaje de éxito
            res.redirect('/docente');
        } catch (error) {
            console.error("Error al procesar las notas:", error);
            res.status(500).send('Ocurrió un error al procesar las notas.');
        }
    }
};
