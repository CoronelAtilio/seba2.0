module.exports = (sequelize, DataTypes) => {
    let alias = "Nota"
    let cols = {
        idnota: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        fk_idalumno_nota: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        },
        fk_idmateriacurso_nota: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        },
        nota1_nota: {
            type: DataTypes.DECIMAL(2,2),
            defaultValue: null
        },
        nota2_nota: {
            type: DataTypes.DECIMAL(2,2),
            defaultValue: null
        },
        nota3_nota: {
            type: DataTypes.DECIMAL(2,2),
            defaultValue: null
        },
        notadic_nota: {
            type: DataTypes.DECIMAL(2,2),
            defaultValue: null
        },
        notafeb_nota: {
            type: DataTypes.DECIMAL(2,2),
            defaultValue: null
        },
        notadef_nota: {
            type: DataTypes.DECIMAL(2,2),
            defaultValue: null
        },
        obs_nota: {
            type: DataTypes.STRING(255),
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
        ciclo_lectivo_nota: {
            type: DataTypes.STRING(4),
            allowNull: false
        }
    }
    let config = {
        tableName: "notas",
        timestamps: true
    }
    const Nota = sequelize.define(alias, cols, config)

    Nota.associate = function(models){

        Nota.belongsTo(models.Alumno, {
            as: "Alumno",
            foreignKey: "fk_idalumno_nota"
        })

        Nota.belongsTo(models.Materia_Curso, {
            as: "Materia_Curso",
            foreignKey: "fk_idmateriacurso_nota"
        })

    }

    return Nota
}