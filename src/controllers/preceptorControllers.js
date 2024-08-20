const db = require('../database/models')
const { Sequelize } = require('sequelize');

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
      
      
      res.render('preceptor/materiaCurso', { materias, cursos, turnos });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send('Ocurrió un error en materia y curso.');
    }
  },
  unirMateriaCurso: async (req, res) => {
    try {
      //trabajo union de materias y cursos
      const materias1 = Array.isArray(req.body.materias) ? req.body.materias.map(Number) : [Number(req.body.materias)];
      const cursos1 = Array.isArray(req.body.cursos) ? req.body.cursos.map(Number) : [Number(req.body.cursos)];
      const turnos1 = req.body.turnos
      console.log(materias1,cursos1,turnos1);
      
      
      let coincidencia = db.Materia_Curso.findOne({
        where:{
          fk_idmateria_materiacurso:materias1,
          fk_idcurso_materiacurso:cursos1,
          turno_materiacurso:turnos1
        }
      })
      
      res.redirect('/preceptor/usuario/materiacurso');
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send('Ocurrió un error en materia y curso.');
    }
  }
};
