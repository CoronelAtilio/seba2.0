module.exports = (sequelize, DataTypes) => {
    let alias = "Materia_Curso"
    let cols = {
        idmateriacurso: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        fk_iddocente_materiacurso: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            defaultValue: null
        },
        fk_idcurso_materiacurso: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            defaultValue: null
        },
        fk_idmateria_materiacurso: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            defaultValue: null
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            defaultValue: null
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            defaultValue: null
        },
        estado_materiacurso: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        }
    }
    let config = {
        tableName: "materias_cursos",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['fk_idcurso_materiacurso', 'fk_idmateria_materiacurso']
            }
        ]
    }
    const Materia_Curso = sequelize.define(alias, cols, config)

    Materia_Curso.associate = function (models) {

        Materia_Curso.belongsTo(models.Docente, {
            as: "Docente",
            foreignKey: "fk_iddocente_materiacurso"
        })

        Materia_Curso.belongsTo(models.Curso, {
            as: "Curso",
            foreignKey: "fk_idcurso_materiacurso"
        })

        Materia_Curso.belongsTo(models.Materia, {
            as: "Materia",
            foreignKey: "fk_idmateria_materiacurso"
        })

        Materia_Curso.hasMany(models.Nota, {
            as : "Notas",
            foreignKey : "fk_idmateriacurso_nota"
        })

    }

    return Materia_Curso
}