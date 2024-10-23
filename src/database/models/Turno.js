module.exports = (sequelize, DataTypes) => {
    let alias = "Turno"
    let cols = {
        idturno: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_turno: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        estado_turno: {
            type: DataTypes.INTEGER(1),
            allowNull : false
        }
    }
    let config = {
        tableName: "turnos",
        timestamps: false
    }
    const Turno = sequelize.define(alias, cols, config)

    Turno.associate = function(models){

        Turno.hasMany(models.Curso, {
            as : "Cursos",
            foreignKey : "fk_idturno_curso"
        })
        
    }

    return Turno
}