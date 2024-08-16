module.exports = (sequelize, DataTypes) => {
    let alias = "Genero"
    let cols = {
        idgenero: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_genero: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
    }
    let config = {
        tableName: "generos",
        timestamps: false
    }
    const Genero = sequelize.define(alias, cols, config)

    Genero.associate = function(models){

        Genero.hasMany(models.Alumno, {
            as : "Alumnos",
            foreignKey : "fk_idgenero_alumno"
        })
        
    }

    return Genero
}