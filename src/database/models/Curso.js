module.exports = (sequelize, DataTypes) => {
    let alias = "Curso"
    let cols = {
        idcurso: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        anio_curso: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        division_curso: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        estado_curso: {
            type: DataTypes.INTEGER(1),
            allowNull : false
        },
        fk_idturno_curso: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            defaultValue: null
        }
    }
    let config = {
        tableName: "cursos",
        timestamps: false
    }
    const Curso = sequelize.define(alias, cols, config)

    Curso.associate = function(models){

        Curso.hasMany(models.Materia_Curso, {
            as : "Materias_Cursos",
            foreignKey : "fk_idcurso_materiacurso"
        })

        Curso.belongsTo(models.Turno, {
            as: "Turno",
            foreignKey: "fk_idturno_curso"
        })
        
    }

    return Curso
}