module.exports = (sequelize, DataTypes) => {
    let alias = "Usuario"
    let cols = {
        idusuario: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        password_usuario: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        nombre_usuario: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        fk_iddocente_usuario: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            defaultValue: null
        },
        fk_idrol_usuario: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull : false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            defaultValue : null
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            defaultValue : null
        },
        estado_usuario: {
            type: DataTypes.INTEGER(1),
            allowNull : false
        }
    }
    let config = {
        tableName: "usuarios",
        timestamps: true 
    }
    const Usuario = sequelize.define(alias, cols, config)

    Usuario.associate = function(models){

        Usuario.belongsTo(models.Rol, {
            as: "Rol",
            foreignKey: "fk_idrol_usuario"
        })

        Usuario.belongsTo(models.Docente, {
            as: "Docente",
            foreignKey: "fk_iddocente_usuario"
        })
        
    }

    return Usuario
}
