module.exports = (sequelize, DataTypes) => {
    let alias = "Cargo"
    let cols = {
        idcargo: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_cargo: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
    }
    let config = {
        tableName: "cargos",
        timestamps: false
    }
    const Cargo = sequelize.define(alias, cols, config)

    Cargo.associate = function(models){
        
        Cargo.hasMany(models.Docente, {
            as: "Docentes",
            foreignKey: "fk_idcargo_docente"
        })

    }

    return Cargo
}
