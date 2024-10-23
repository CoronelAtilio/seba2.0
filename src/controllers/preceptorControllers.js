const db = require('../database/models')
const { Sequelize, or, where } = require('sequelize');
const { Op } = require('sequelize');
const { logger } = require('sequelize/lib/utils/logger');
const startOfYear = new Date(new Date().getFullYear(), 0, 1);
const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

module.exports = {
  index: (req, res) => {
    res.render('preceptor/preceptor')
  },
  materiaCurso: async (req, res) => {
    try {
      const [materias, cursos, turnos] = await Promise.all([
        db.Materia.findAll(),
        db.Curso.findAll({
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('anio_curso')), 'anio_curso']
          ]
        })
      ]);

      //codigo proveniente de "unirMateriaCurso"
      let materiasFinal = null
      if (req.session && req.session.materiasFinal) {
        materiasFinal = req.session.materiasFinal;
        delete req.session.materiasFinal;
      }

      res.render('preceptor/materiaCurso', { materias, cursos, materiasFinal });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send('Ocurrió un error en materia y curso.');
    }
  },
  unirMateriaCurso: async (req, res) => {
    try {
      // Transformar los datos en arrays
      let materias = Array.isArray(req.body.materias)
        ? req.body.materias.map(Number).filter(n => !isNaN(n))
        : [Number(req.body.materias)].filter(n => !isNaN(n));

      let anioCursos = Array.isArray(req.body.cursos)
        ? req.body.cursos.filter(c => c && c !== 'undefined')
        : [req.body.cursos].filter(c => c && c !== 'undefined');

      if (!materias.length || !anioCursos.length) {
        return res.redirect('/preceptor/usuario/materiacurso');
      }

      // Obtener los idcurso basados en los años curso
      const cursos = await db.Curso.findAll({
        where: { "anio_curso": anioCursos },
        attributes: ['idcurso']
      });

      const idCursos = cursos.map(curso => curso.idcurso);

      if (!idCursos.length) {
        return res.redirect('/preceptor/usuario/materiacurso');
      }

      // Llamar al procedimiento almacenado
      await db.sequelize.query(`
        CALL relacion_materias_cursos(:materias, :cursos, @valoresError);
      `, {
        replacements: {
          materias: JSON.stringify(materias),
          cursos: JSON.stringify(idCursos)
        }
      });

      // Ejecutar un SELECT para obtener el valor de la variable de salida
      const [results] = await db.sequelize.query(`SELECT @valoresError AS valoresError;`);
      const valoresError = JSON.parse(results[0].valoresError);

      // Verificar si existen errores
      if (valoresError.length > 0) {
        const fkMaterias = valoresError
          .map(item => item.materia)
          .filter((materia, index, self) => self.indexOf(materia) === index);

        const fkCursos = valoresError
          .map(item => item.curso)
          .filter((curso, index, self) => self.indexOf(curso) === index);

        // Crear nuevas variables para almacenar los resultados
        const materiasResult = await db.Materia.findAll({
          where: { idmateria: fkMaterias }
        });

        const cursosResult = await db.Curso.findAll({
          where: { idcurso: fkCursos },
          include: [{
            model: db.Turno,
            as: 'Turno',
            attributes: ['nombre_turno']
          }]
        });

        let materiasMap = materiasResult.reduce((acc, materia) => {
          acc[materia.idmateria] = materia.nombre_materia;
          return acc;
        }, {});

        let cursosMap = cursosResult.reduce((acc, curso) => {
          acc[curso.idcurso] = {
            curso: `${curso.anio_curso} ${curso.division_curso}`,
            turno: curso.Turno ? curso.Turno.nombre_turno : 'Sin turno'
          };
          return acc;
        }, {});
        

        let materiasFinal = valoresError.map(item => ({
          ...item,
          materia: materiasMap[item.materia],
          curso: cursosMap[item.curso].curso,
          turno: cursosMap[item.curso].turno
        }));

        req.session.materiasFinal = materiasFinal;

        return res.redirect('/preceptor/usuario/materiacurso');

      } else {
        // Crear las combinaciones e insertar
        const newCombinations = [];
        for (let materia of materias) {
          for (let curso of idCursos) {
              newCombinations.push({
                fk_idmateria_materiacurso: materia,
                fk_idcurso_materiacurso: curso,
                estado_materiacurso: 1
              });
          }
        }
      

        await db.Materia_Curso.bulkCreate(newCombinations, { ignoreDuplicates: false });

        res.redirect('/preceptor/usuario/materiacurso');
      }

    } catch (error) {
      console.error("Error:", error);
      res.status(500).send('Ocurrió un error al unir materias y cursos.');
    }
  },
  MateriaCursoDocente: async (req, res) => {
    try {
      //traigo materiascursos con docente null
      const [materiasCursos, docentes] = await Promise.all([
        db.Materia_Curso.findAll({
          where: {
            fk_iddocente_materiacurso: null
          },
          include: [
            {
              model: db.Curso,
              as: 'Curso',
              attributes: ['anio_curso', 'division_curso'],
              include: [{
                model:db.Turno,
                as: 'Turno',
                attributes:['nombre_turno']
              }]
            },
            {
              model: db.Materia,
              as: 'Materia',
              attributes: ['nombre_materia']
            }
          ],
          attributes: {
            exclude: ['fk_idcurso_materiacurso', 'fk_idmateria_materiacurso', 'fk_idturno_curso']
          }
        }),
        db.Docente.findAll({
          attributes: [
            'iddocente',
            'apellido_docente',
            'nombre_docente'
          ]
        })
      ]);


      // Extrayendo los valores de fk_idcurso_materiacurso y fk_idmateria_materiacurso

      const datosFiltrados = materiasCursos.map(item => ({
        idmateriacurso: item.idmateriacurso,
        turno_materiacurso: item.Curso.Turno.nombre_turno,
        anio_curso: item.Curso.anio_curso,
        division_curso: item.Curso.division_curso,
        nombre_materia: item.Materia.nombre_materia
      }));

      const docentesFiltrados = docentes.map(item => ({
        iddocente: item.iddocente,
        apellido_docente: item.apellido_docente,
        nombre_docente: item.nombre_docente
      }))


      res.render('preceptor/materiaCursoDocente', { datosFiltrados, docentesFiltrados })
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send('Ocurrió un error en materia_curso y docente.');
    }
  },
  unirMateriaCursoDocente: async (req, res) => {
    let materiascursos = Array.isArray(req.body.materiascursos)
      ? req.body.materiascursos.map(Number).filter(n => !isNaN(n))
      : [Number(req.body.materiascursos)].filter(n => !isNaN(n));

    let docentes = Array.isArray(req.body.docentes)
      ? req.body.docentes.map(c => isNaN(Number(c)) ? null : Number(c)).filter(n => n !== null)
      : [Number(req.body.docentes)].filter(n => !isNaN(n));

    // Verificar si alguno de los arrays está vacío o contiene NaN
    if (!materiascursos.length || !docentes.length) {

      return res.redirect('/preceptor/usuario/materiacursodocente');
    }
    //no hace falta buscar coincidencias ya que traigo elementos con docente null

    await db.Materia_Curso.update(
      {
        fk_iddocente_materiacurso: docentes
      },
      {
        where: {
          idmateriacurso: materiascursos
        }
      }
    );

    res.redirect('/preceptor/usuario/materiacursodocente')

  },
  MateriaCursoAlumno: async (req, res) => {
    try {
      const [cursos, alumnos] = await Promise.all([
        db.Curso.findAll({
          attributes: ['idcurso', 'anio_curso', 'division_curso'],
          include: [{
            model: db.Turno,
            as: 'Turno',
            attributes: ['nombre_turno']
          }]
        }),
        db.Alumno.findAll({
          where: {
            createdAt: {
              [Op.gte]: startOfYear,
              [Op.lt]: endOfYear
            }
          },
          attributes: ['idalumno', 'apellido_alumno', 'nombre_alumno'],
          include: [{
            model: db.Nota,
            as: 'Notas',
            required: false, // LEFT JOIN para incluir alumnos sin notas
            attributes: [],  // No necesitamos datos de la tabla Notas
          }],
          where: {
            '$Notas.fk_idalumno_nota$': {
              [Op.is]: null // Solo alumnos sin relación en la tabla Notas
            }
          }
        })
      ]);
      
      
  
      // Mapear los cursos con sus respectivos turnos
      const cursosFiltrados = cursos.map(item => ({
        idcurso: item.idcurso,
        anio_curso: item.anio_curso,
        division_curso: item.division_curso,
        nombre_turno: item.Turno ? item.Turno.nombre_turno : 'Sin turno'
      }));
  
      // Mapear los alumnos
      const alumnosFiltrados = alumnos.map(item => ({
        idalumno: item.idalumno,
        apellido_alumno: item.apellido_alumno,
        nombre_alumno: item.nombre_alumno
      }));  
  
      // Renderizar la vista con los datos filtrados
      res.render('preceptor/materiaCursoAlumno', { cursosFiltrados, alumnosFiltrados });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send('Ocurrió un error en materia_curso y alumno.');
    }
  },  
  unirMateriaCursoAlumno: async (req, res) => {
    try {
      let cursos = Array.isArray(req.body.cursos)
        ? req.body.cursos.map(Number).filter(n => !isNaN(n))
        : [Number(req.body.cursos)].filter(n => !isNaN(n));
  
      let alumnos = Array.isArray(req.body.alumnos)
        ? req.body.alumnos.map(c => isNaN(Number(c)) ? null : Number(c)).filter(n => n !== null)
        : [Number(req.body.alumnos)].filter(n => !isNaN(n));
      
      let errors = [];
  
      // Verificar si alguno de los arrays está vacío o contiene NaN
      if (!cursos.length || !alumnos.length) {
        errors.push("Error: Faltan materias o alumnos para realizar la inscripción.");
      }
  
      let materiascursos = await db.Materia_Curso.findAll({
        attributes: ['idmateriacurso'],
        where: { 'fk_idcurso_materiacurso': cursos }
      });
  
      if (materiascursos.length === 0) {
        return res.redirect('/preceptor/usuario/materiacursoalumno');
      }
      
      const materiasCursosFiltrados = materiascursos.map(item => item.idmateriacurso);
  
      // Buscar combinaciones existentes de alumno-materiacurso
      let coincidencias = await db.Nota.findAll({
        where: {
          fk_idalumno_nota: alumnos,
          fk_idmateriacurso_nota: materiasCursosFiltrados
        }
      });
      
      
      if (coincidencias.length > 0) {
        errors.push("Error: El alumno ya está inscrito en alguna materia y curso.");
      }
  
      // Si hay errores, mostrarlos todos juntos
      if (errors.length > 0) {
        console.log(errors.join("\n"));
        return res.redirect('/preceptor/usuario/materiacursoalumno');
      }
  
      const cicloLectivo = new Date().getFullYear().toString();
  
      // Si no hay duplicados, realizar inserción
      let notas = alumnos.map(alumno => {
        return materiascursos.map(materiacurso => {
          return {
            fk_idalumno_nota: alumno,
            fk_idmateriacurso_nota: materiacurso.idmateriacurso,
            ciclo_lectivo_nota: cicloLectivo,
          };
        });
      }).flat();
      
      await db.Nota.bulkCreate(notas);
  
      res.redirect('/preceptor/usuario/materiacursoalumno');
    } catch (error) {
      console.error("Error durante la operación:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send("Error: Ya existe una inscripción con el mismo alumno y materia.");
      }
      return res.status(500).send("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
    }
  }
  
};
