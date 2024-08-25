const db = require('../database/models')
const { Sequelize, or } = require('sequelize');

module.exports = {
  index: (req, res) => {
    res.render('preceptor/preceptor')
  },
  materiaCurso: async (req, res) => {
    try {
      const [materias, cursos, turnos] = await Promise.all([
        db.Materia.findAll(),
        db.Curso.findAll(),
        db.Materia_Curso.findAll({
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('turno_materiacurso')), 'turno_materiacurso']
          ]
        })
      ]);

      let materiasFinal = null
      if (req.session && req.session.materiasFinal) {
        materiasFinal = req.session.materiasFinal;
        delete req.session.materiasFinal;
      }

      res.render('preceptor/materiaCurso', { materias, cursos, turnos, materiasFinal });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send('Ocurrió un error en materia y curso.');
    }
  },
  unirMateriaCurso: async (req, res) => {
    try {
      //trabajo union de materias y cursos
      //transformo en arrays
      let materias = Array.isArray(req.body.materias) ? req.body.materias.map(Number).filter(n => !isNaN(n)) : [Number(req.body.materias)];
      let cursos = Array.isArray(req.body.cursos) ? req.body.cursos.map(c => isNaN(Number(c)) ? null : Number(c)).filter(n => n !== null) : [Number(req.body.cursos)];
      let turnos = Array.isArray(req.body.turnos) ? req.body.turnos.filter(t => t && t !== 'undefined') : [req.body.turnos].filter(t => t && t !== 'undefined');

      //en caso de estar incompleto regresa al sitio
      if (!materias.length || !cursos.length || !turnos.length) {
        console.log('paso por aqui');
        return res.redirect('/preceptor/usuario/materiacurso');
      }


      // Ejecutar el procedimiento almacenado para verificar
      await db.sequelize.query(
        `CALL relacion_materias_cursos(:materias, :cursos, :turnos, @valoresError);`,
        {
          replacements: {
            materias: JSON.stringify(materias),
            cursos: JSON.stringify(cursos),
            turnos: JSON.stringify(turnos),
          },
        }
      );

      // Ejecutar un SELECT separado para obtener el valor de la variable de salida
      const [results] = await db.sequelize.query(`SELECT @valoresError AS valoresError;`);
      const valoresError = JSON.parse(results[0].valoresError)


      if (valoresError.length > 0) {
        //obtengo foraneas y elementos unicos por filtro
        fkMaterias = valoresError
          .map(item => item.materia)
          .filter((materia, index, self) => self.indexOf(materia) === index);

        fkCursos = valoresError
          .map(item => item.curso)
          .filter((curso, index, self) => self.indexOf(curso) === index);

        turnosRepetidos = valoresError
          .map(item => item.turno)
          .filter((turno, index, self) => self.indexOf(turno) === index);
        console.log(materias, cursos, turnos);

        [materias, cursos, turnos] = await Promise.all([
          db.Materia.findAll({
            where: {
              idmateria: fkMaterias
            }
          }),
          db.Curso.findAll({
            where: {
              idcurso: fkCursos
            }
          }),
          db.Materia_Curso.findAll({
            attributes: [
              [Sequelize.fn('DISTINCT', Sequelize.col('turno_materiacurso')), 'turno_materiacurso']
            ]
          })
        ]);

        // Reemplazar los valores numéricos por los nombres correspondientes
        const materiasMap = materias.reduce((acc, materia) => {
          acc[materia.idmateria] = materia.nombre_materia;
          return acc;
        }, {});

        const cursosMap = cursos.reduce((acc, curso) => {
          acc[curso.idcurso] = `${curso.anio_curso} ${curso.division_curso}`;
          return acc;
        }, {});

        const materiasFinal = valoresError.map(item => ({
          ...item,
          materia: materiasMap[item.materia],
          curso: cursosMap[item.curso]
        }));
        console.log(materiasFinal);

        req.session.materiasFinal = materiasFinal;

        return res.redirect('/preceptor/usuario/materiacurso')
      }
      console.log(materias, cursos, turnos);

      //Funcion para insertar todos los elementos
      async function insertMateriasCursos() {
        // Array donde almacenarás los objetos estructurados
        const data = [];
      
        // Bucle para combinar los arrays
        for (const materia of materias) {
          for (const curso of cursos) {
            for (const turno of turnos) {
              data.push({
                fk_idmateria_materiacurso: materia,
                fk_idcurso_materiacurso: curso,
                turno_materiacurso: turno,
                fk_iddocente_materiacurso: null, // Puedes asignar un valor si lo tienes, aquí es null
                estado_materiacurso: 1, // Valor por defecto como indicaste
              });
            }
          }
        }
      
        // Inicia la transacción
        const transaction = await db.sequelize.transaction();
      
        try {
          // Inserta los datos utilizando bulkCreate con la transacción
          await db.Materia_Curso.bulkCreate(data, { transaction });
      
          // Si todo va bien, confirma la transacción
          await transaction.commit();
          console.log('Datos insertados exitosamente');
        } catch (error) {
          // Si ocurre algún error, revierte la transacción
          await transaction.rollback();
          console.error('Error al insertar los datos:', error);
        }
      }
      
      // Llamar a la función para ejecutar la inserción
      insertMateriasCursos();
      

      //Volver
      res.redirect('/preceptor/usuario/materiacurso')


    } catch (error) {
      console.error("Error:", error);
      res.status(500).send('Ocurrió un error en materia y curso.');
    }
  },
  unirMateriaCursoDocente: async (req, res) => {
    try {
      res.render('preceptor/materiaCursoDocente')
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send('Ocurrió un error en materia_curso y docente.');
    }
  }
};
