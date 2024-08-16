module.exports = (sequelize, DataTypes) => {
    let alias = "Situacion"
    let cols = {
        idsituacion: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_situacion: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
    }
    let config = {
        tableName: "situaciones",
        timestamps: false
    }
    const Situacion = sequelize.define(alias, cols, config)

    Situacion.associate = function(models){

        Situacion.hasMany(models.Docente, {
            as : "Docentes",
            foreignKey : "fk_idsituacion_docente"
        })
        
    }

    return Situacion
}