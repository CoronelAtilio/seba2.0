module.exports = (sequelize, DataTypes) => {
    let alias = "Docente"
    let cols = {
        iddocente: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        dni_docente: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        },
        email_docente: {
            type: DataTypes.STRING(100),
            defaultValue: null,
            unique: true
        },
        celular_docente: {
            type: DataTypes.STRING(15),
            defaultValue: null,
            unique: true
        },
        apellido_docente: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        nombre_docente: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        fecha_nac_docente: {
            type: DataTypes.DATE,
            allowNull: false
        },
        fk_idcargo_docente: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            defaultValue: null
        },
        fk_idsituacion_docente: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            defaultValue: null
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
        estado_docente: {
            type: DataTypes.INTEGER(1),
            allowNull : false
        }
    }
    let config = {
        tableName: "docentes",
        timestamps: true
    }
    const Docente = sequelize.define(alias, cols, config)

    Docente.associate = function(models){
        Docente.belongsTo(models.Cargo, {
            as: "Cargo",
            foreignKey: "fk_idcargo_docente"
        })

        Docente.belongsTo(models.Situacion, {
            as: "Situacion",
            foreignKey: "fk_idsituacion_docente"
        })

        Docente.hasMany(models.Materia_Curso, {
            as: "Materias_Cursos",
            foreignKey: "fk_iddocente_materiacurso"
        })

        Docente.hasMany(models.Usuario, {
            as: "Usuarios",
            foreignKey: "fk_iddocente_usuario"
        })

    }

    return Docente
}
