module.exports = (sequelize, DataTypes) => {
    let alias = "Rol"
    let cols = {
        idrol: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_rol: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
    }
    let config = {
        tableName: "roles",
        timestamps: false
    }
    const Rol = sequelize.define(alias, cols, config)

    Rol.associate = function(models){

        Rol.hasMany(models.Usuario, {
            as: "Usuarios",
            foreignKey: "fk_idrol_usuario"
        })
    }

    return Rol
}
