module.exports = (sequelize, DataTypes) => {
    let alias = "Materia"
    let cols = {
        idmateria: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_materia: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        estado_materia: {
            type: DataTypes.INTEGER(1),
            allowNull : false
        }
    }
    let config = {
        tableName: "materias",
        timestamps: false
    }
    const Materia = sequelize.define(alias, cols, config)

    Materia.associate = function(models){

        Materia.hasMany(models.Materia_Curso, {
            as : "Materias_Cursos",
            foreignKey : "fk_idmateria_materiacurso"
        })

    }

    return Materia
    }