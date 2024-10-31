module.exports = (sequelize, DataTypes) => {
    let alias = "Tutor"
    let cols = {
        idtutor: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        dni_tutor: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        email_tutor: {
            type: DataTypes.STRING(100),
            defaultValue : null
        },
        celular_tutor: {
            type: DataTypes.STRING(15),
            defaultValue : null
        },
        apellido_tutor: {
            type: DataTypes.STRING(100),
            defaultValue : null
        },
        nombre_tutor: {
            type: DataTypes.STRING(100),
            defaultValue : null
        },
        direccion_tutor: {
            type: DataTypes.STRING(100),
            defaultValue : null
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
        estado_tutor: {
            type: DataTypes.INTEGER(1),
            allowNull : false
        }
    }
    let config = {
        tableName: "tutores",
        timestamps: true
    }
    const Tutor = sequelize.define(alias, cols, config)

    Tutor.associate = function(models){

        Tutor.hasMany(models.Alumno, {
            as : "Alumnos",
            foreignKey : "fk_idtutor_alumno"
        })
        
    }

    return Tutor
}